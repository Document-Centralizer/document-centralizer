package com.documentcentralizer.controller;

import com.documentcentralizer.dto.UserProfileDTO;
import com.documentcentralizer.service.UserService;
import org.springframework.http.ResponseEntity;
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
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@RequestParam String email) {
        // Temporarily accepting email as a parameter for testing purposes (since JWT is not implemented)
        UserProfileDTO profile = userService.getUserProfile(email);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @RequestParam String email, 
            @RequestBody com.documentcentralizer.dto.UpdateProfileRequestDTO updateDto) {
        UserProfileDTO updatedProfile = userService.updateAccountSettings(email, updateDto);
        return ResponseEntity.ok(updatedProfile);
    }
}
