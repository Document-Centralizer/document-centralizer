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
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;


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

    @Override
    public java.util.List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserProfileDTO.class))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public void deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }

    @Override
    public com.documentcentralizer.dto.SubscriptionDashboardDTO getSubscriptionDashboardData() {
        java.util.List<com.documentcentralizer.entity.User> users = userRepository.findAll();
        
        long basicCount = 0;
        long proCount = 0;
        
        java.util.List<UserProfileDTO> subscribedUsers = new java.util.ArrayList<>();
        
        for (com.documentcentralizer.entity.User user : users) {
            String plan = user.getSubscriptionPlan();
            if (plan != null) {
                if (plan.equalsIgnoreCase("Basic")) basicCount++;
                else if (plan.equalsIgnoreCase("Pro")) proCount++;
            }
            subscribedUsers.add(modelMapper.map(user, UserProfileDTO.class));
        }
        
        return com.documentcentralizer.dto.SubscriptionDashboardDTO.builder()
                .basicCount(basicCount)
                .proCount(proCount)
                .subscribedUsers(subscribedUsers)
                .build();
    }

    @Override
    public void changePassword(Long userId, com.documentcentralizer.dto.ChangePasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
