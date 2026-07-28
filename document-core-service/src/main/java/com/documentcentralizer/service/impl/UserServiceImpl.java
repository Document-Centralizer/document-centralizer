package com.documentcentralizer.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.documentcentralizer.dto.UpdateProfileRequestDTO;
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
    public UserProfileDTO updateUserProfile(String email, UpdateProfileRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Update strictly allowed fields
        if(request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if(request.getLastName() != null) user.setLastName(request.getLastName());
        if(request.getMobileNumber() != null) user.setMobileNumber(request.getMobileNumber());
        if(request.getUsername() != null) user.setUsername(request.getUsername());
        if(request.getDob() != null) user.setDob(request.getDob());
        if(request.getGender() != null) user.setGender(request.getGender());
        if(request.getAddress() != null) user.setAddress(request.getAddress());
        if(request.getCity() != null) user.setCity(request.getCity());
        if(request.getState() != null) user.setState(request.getState());
        if(request.getCountry() != null) user.setCountry(request.getCountry());
        if(request.getPincode() != null) user.setPincode(request.getPincode());

        user = userRepository.save(user);

        return modelMapper.map(user, UserProfileDTO.class);
    }
}
