package com.documentcentralizer.service;

import com.documentcentralizer.dto.UserProfileDTO;

public interface UserService {
    /**
     * Retrieves the profile information for the given user email.
     * @param email The email of the user
     * @return UserProfileDTO containing safe profile details
     */
    UserProfileDTO getUserProfile(String email);
}
