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
}
