package com.documentcentralizer.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.documentcentralizer.dto.AuthResponseDTO;
import com.documentcentralizer.dto.LoginRequestDTO;
import com.documentcentralizer.dto.RegisterRequestDTO;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.enums.Role;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final ModelMapper modelMapper;

	@Override
	public AuthResponseDTO register(RegisterRequestDTO request) {
		// Check duplicate email
	    if (userRepository.existsByEmail(request.getEmail())) {
	        throw new RuntimeException("Email already exists");
	    }

	    // Check duplicate mobile number
	    if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
	        throw new RuntimeException("Mobile number already exists");
	    }

	    User user = modelMapper.map(request, User.class);

	    user.setPassword(passwordEncoder.encode(request.getPassword()));
	    user.setRole(Role.USER);
	    user.setEnabled(true);

	    userRepository.save(user);

	    return new AuthResponseDTO(
	            "Registration Successful",
	            user.getEmail(),
	            user.getRole());
	}

	@Override
	public AuthResponseDTO login(LoginRequestDTO request) {
		// TODO Auto-generated method stub
		return null;
	}
	public AuthServiceImpl(UserRepository userRepository,PasswordEncoder passwordEncoder,ModelMapper modelMapper) {
	    this.userRepository = userRepository;
	    this.passwordEncoder = passwordEncoder;
	    this.modelMapper = modelMapper;
	}

}
