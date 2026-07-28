package com.documentcentralizer.service;

import com.documentcentralizer.dto.UpdateProfileRequestDTO;
import com.documentcentralizer.dto.UserProfileDTO;

public interface UserService {
    /**
     * Retrieves the profile information for the given user email.
     * @param email The email of the user
     * @return UserProfileDTO containing safe profile details
     */
    UserProfileDTO getUserProfile(String email);

    /**
     * Updates the profile information for the given user email.
     * @param email The email of the user
     * @param request The safe editable fields
     * @return UserProfileDTO containing the updated safe profile details
     */
    UserProfileDTO updateUserProfile(String email, UpdateProfileRequestDTO request);
}
