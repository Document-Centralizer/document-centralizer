package com.documentcentralizer.controller;

import com.documentcentralizer.dto.UserProfileDTO;
import com.documentcentralizer.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/*
 * Class Name : UserController
 *
 * Purpose:
 * Exposes REST API endpoints for User operations.
 *
 * Responsibility:
 * - Handle user profile and dashboard requests
 *
 * Author:
 * CDAC Project
 */
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        // Extract the user ID from the JWT token (set in SecurityContext by JwtFilter)
        Long userId = Long.parseLong(authentication.getName());
        UserProfileDTO profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication authentication, 
            @RequestBody com.documentcentralizer.dto.UpdateProfileRequestDTO updateDto) {
        Long userId = Long.parseLong(authentication.getName());
        UserProfileDTO updatedProfile = userService.updateAccountSettings(userId, updateDto);
        return ResponseEntity.ok(updatedProfile);
    }
}
