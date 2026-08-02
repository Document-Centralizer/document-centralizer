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
}
