package com.documentcentralizer.service;

import com.documentcentralizer.dto.UserProfileDTO;

public interface UserService {
    /**
     * Retrieves the profile information for the given user ID.
     * @param userId The ID of the user
     * @return UserProfileDTO containing safe profile details
     */
    UserProfileDTO getUserProfile(Long userId);

    /**
     * Updates the account settings for the given user ID.
     * @param userId The ID of the user
     * @param dto The profile details to update
     * @return UserProfileDTO containing safe profile details
     */
    UserProfileDTO updateAccountSettings(Long userId, com.documentcentralizer.dto.UpdateProfileRequestDTO dto);

    /**
     * Uploads and updates the user's profile image.
     * @param userId The ID of the user
     * @param file The image file to upload
     * @return UserProfileDTO containing safe profile details
     */
    UserProfileDTO uploadProfileImage(Long userId, org.springframework.web.multipart.MultipartFile file);

    /**
     * Downloads the profile image for the given user ID.
     * @param userId The ID of the user
     * @return Resource representing the image file
     */
    org.springframework.core.io.Resource downloadProfileImage(Long userId);

    /**
     * Retrieves all users.
     * @return List of UserProfileDTO
     */
    java.util.List<UserProfileDTO> getAllUsers();

    /**
     * Deletes a user by ID.
     * @param userId The ID of the user
     */
    void deleteUser(Long userId);

    com.documentcentralizer.dto.SubscriptionDashboardDTO getSubscriptionDashboardData();

    void changePassword(Long userId, com.documentcentralizer.dto.ChangePasswordRequestDTO request);
}
