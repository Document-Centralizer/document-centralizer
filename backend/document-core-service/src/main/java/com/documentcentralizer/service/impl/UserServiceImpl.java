package com.documentcentralizer.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.documentcentralizer.dto.UserProfileDTO;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserProfileDTO getUserProfile(String email) {
        // Validate user existence before returning data
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Return complete user profile details (safely mapped to DTO without password)
        return modelMapper.map(user, UserProfileDTO.class);
    }

    @Override
    public UserProfileDTO updateAccountSettings(String email, com.documentcentralizer.dto.UpdateProfileRequestDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Ensure only non-null properties from DTO overwrite existing fields
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(dto, user);
        
        userRepository.save(user);
        
        return modelMapper.map(user, UserProfileDTO.class);
    }
}
