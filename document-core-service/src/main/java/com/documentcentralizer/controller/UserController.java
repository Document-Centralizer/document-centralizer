package com.documentcentralizer.controller;

import com.documentcentralizer.dto.UserProfileDTO;
import com.documentcentralizer.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "User APIs", description = "Endpoints for regular user operations like profile management and dashboard")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "View User Profile", description = "Retrieves the profile information of the currently authenticated user.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved profile"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@RequestParam String email) {
        // Temporarily accepting email as a parameter for testing purposes (since JWT is not implemented)
        UserProfileDTO profile = userService.getUserProfile(email);
        return ResponseEntity.ok(profile);
    }

    @Operation(summary = "Update User Profile", description = "Updates the profile information.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @RequestParam String email,
            @Valid @RequestBody UpdateProfileRequestDTO request) {
        
        UserProfileDTO updatedProfile = userService.updateUserProfile(email, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @Operation(summary = "User Dashboard Data", description = "Retrieves statistics and summary data for the user dashboard.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok().build();
    }
}
