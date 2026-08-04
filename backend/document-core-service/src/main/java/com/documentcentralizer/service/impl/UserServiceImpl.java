package com.documentcentralizer.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.documentcentralizer.dto.UserProfileDTO;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final com.documentcentralizer.service.S3Service s3Service;


    @Override
    public UserProfileDTO getUserProfile(Long userId) {
        // Validate user existence before returning data
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Return complete user profile details (safely mapped to DTO without password)
        return modelMapper.map(user, UserProfileDTO.class);
    }

    @Override
    public UserProfileDTO updateAccountSettings(Long userId, com.documentcentralizer.dto.UpdateProfileRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Ensure only non-null properties from DTO overwrite existing fields
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(dto, user);
        
        userRepository.save(user);
        
        return modelMapper.map(user, UserProfileDTO.class);
    }

    @Override
    public UserProfileDTO uploadProfileImage(Long userId, org.springframework.web.multipart.MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Delete old profile image if it exists in S3
        if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isEmpty()) {
            try {
                s3Service.deleteFile(user.getProfileImageUrl());
            } catch (Exception e) {
                // Log and ignore to avoid blocking the upload process
                System.err.println("Failed to delete old profile image: " + e.getMessage());
            }
        }

        // Upload new image to S3
        String objectKey = s3Service.uploadFile(file);
        
        // Save S3 key to the user's profileImageUrl field
        user.setProfileImageUrl(objectKey);
        userRepository.save(user);
        
        return modelMapper.map(user, UserProfileDTO.class);
    }

    @Override
    public org.springframework.core.io.Resource downloadProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (user.getProfileImageUrl() == null || user.getProfileImageUrl().isEmpty()) {
            throw new RuntimeException("Profile image not found");
        }
        
        return s3Service.downloadFile(user.getProfileImageUrl());
    }
}
