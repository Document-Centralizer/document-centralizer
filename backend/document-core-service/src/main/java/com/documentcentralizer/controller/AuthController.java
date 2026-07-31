package com.documentcentralizer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.documentcentralizer.dto.AuthResponseDTO;
import com.documentcentralizer.dto.LoginRequestDTO;
import com.documentcentralizer.dto.RegisterRequestDTO;
import com.documentcentralizer.service.AuthService;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication APIs", description = "Endpoints for user registration, login, and password management")
public class AuthController {

    private final AuthService authService;
    private final org.springframework.security.authentication.AuthenticationManager authMgr;
    private final com.documentcentralizer.security.JwtUtil jwtUtil;

    public AuthController(AuthService authService, 
                          org.springframework.security.authentication.AuthenticationManager authMgr, 
                          com.documentcentralizer.security.JwtUtil jwtUtil) {
        this.authService = authService;
        this.authMgr = authMgr;
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "Register a new user", description = "Registers a new user in the system with the provided details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "409", description = "User already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Parameter(description = "User registration details")
            @Valid @RequestBody RegisterRequestDTO request) {

        AuthResponseDTO response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Login an existing user", description = "Authenticates a user and returns a JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Parameter(description = "User login credentials")
            @Valid @RequestBody LoginRequestDTO request) {

        try {
            // 1. Create authentication token with credentials
            org.springframework.security.core.Authentication authToken = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword());
            
            // 2. Authenticate using AuthenticationManager
            org.springframework.security.core.Authentication auth = authMgr.authenticate(authToken);
            
            // 3. Generate JWT token
            String jwt = jwtUtil.createToken(auth); 
            
            // 4. Return token
            // Creating a simple response object on the fly to match the PDF's LoginResponse
            return ResponseEntity.ok(java.util.Map.of("token", jwt));
            
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @Operation(summary = "Refresh JWT Token", description = "Generates a new JWT token using a valid refresh token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken() {
        // Stub for documentation purposes
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Logout user", description = "Logs out the user and invalidates their token.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logged out successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stub for documentation purposes
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Forgot Password", description = "Initiates password reset process and sends an email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset email sent"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        // Stub for documentation purposes
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Reset Password", description = "Resets the user's password using a valid token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        // Stub for documentation purposes
        return ResponseEntity.ok().build();
    }
}