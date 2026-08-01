package com.documentcentralizer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.documentcentralizer.dto.AuthResponseDTO;
import com.documentcentralizer.dto.LoginRequestDTO;
import com.documentcentralizer.dto.RegisterRequestDTO;
import com.documentcentralizer.service.AuthService;
import jakarta.validation.Valid;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import com.documentcentralizer.security.JwtUtil;
import java.util.Map;
import com.documentcentralizer.service.RefreshTokenService;
import com.documentcentralizer.entity.RefreshToken;
import com.documentcentralizer.dto.RefreshTokenRequestDTO;
import com.documentcentralizer.entity.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authMgr;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService authService, 
                          AuthenticationManager authMgr, 
                          JwtUtil jwtUtil,
                          RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.authMgr = authMgr;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {

        AuthResponseDTO response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {

        try {
            // 1. Create authentication token with credentials
            Authentication authToken = new UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword());
            
            // 2. Authenticate using AuthenticationManager
            Authentication auth = authMgr.authenticate(authToken);
            
            // 3. Generate JWT token
            String jwt = jwtUtil.createToken(auth); 
            
            // 4. Generate Refresh Token
            User user = (User) auth.getPrincipal();
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
            
            // 5. Return tokens
            // Creating a simple response object on the fly to match the PDF's LoginResponse
            return ResponseEntity.ok(Map.of("token", jwt, "refreshToken", refreshToken.getToken()));
            
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        // Validate the refresh token and generate a new JWT for the user.
        // This allows users to stay logged in without re-entering credentials when their short-lived JWT expires.
        try {
            return refreshTokenService.findByToken(request.getRefreshToken())
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser)
                    .map(user -> {
                        String token = jwtUtil.createToken(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
                        return ResponseEntity.ok(Map.of("token", token, "refreshToken", request.getRefreshToken()));
                    })
                    .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader);
        }
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.documentcentralizer.dto.ForgotPasswordRequest request) {
        authService.processForgotPassword(request);
        return ResponseEntity.ok(java.util.Map.of("message", "If the email exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody com.documentcentralizer.dto.ResetPasswordRequest request) {
        try {
            authService.processResetPassword(request);
            return ResponseEntity.ok(java.util.Map.of("message", "Password reset successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}