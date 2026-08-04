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
    private final com.documentcentralizer.service.DocumentService documentService;


    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        // Extract the user ID from the JWT token (set in SecurityContext by JwtFilter)
        Long userId = Long.parseLong(authentication.getName());
        UserProfileDTO profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<com.documentcentralizer.dto.UserDashboardStatsDTO> getDashboard(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(documentService.getUserDashboardStats(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication authentication, 
            @RequestBody com.documentcentralizer.dto.UpdateProfileRequestDTO updateDto) {
        Long userId = Long.parseLong(authentication.getName());
        UserProfileDTO updatedProfile = userService.updateAccountSettings(userId, updateDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping(value = "/profile/image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileDTO> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        Long userId = Long.parseLong(authentication.getName());
        UserProfileDTO updatedProfile = userService.uploadProfileImage(userId, file);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/profile/image/{userId}")
    public ResponseEntity<org.springframework.core.io.Resource> getProfileImage(@PathVariable Long userId) {
        org.springframework.core.io.Resource resource = userService.downloadProfileImage(userId);
        
        // Determine content type dynamically or assume JPEG/PNG based on S3 metadata
        // For simplicity, we just return the bytes with standard image headers.
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                .body(resource);
    }
}
