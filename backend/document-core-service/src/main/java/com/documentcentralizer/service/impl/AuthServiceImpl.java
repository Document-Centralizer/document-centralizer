package com.documentcentralizer.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.documentcentralizer.dto.AuthResponseDTO;
import com.documentcentralizer.dto.LoginRequestDTO;
import com.documentcentralizer.dto.RegisterRequestDTO;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.entity.Role;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.service.AuthService;

import com.documentcentralizer.entity.PasswordResetToken;
import com.documentcentralizer.repository.PasswordResetTokenRepository;
import com.documentcentralizer.service.EmailService;
import com.documentcentralizer.dto.ForgotPasswordRequest;
import com.documentcentralizer.dto.ResetPasswordRequest;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final ModelMapper modelMapper;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final EmailService emailService;

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
	@Override
	@Transactional
	public void processForgotPassword(ForgotPasswordRequest request) {
		log.info("Processing forgot password for email: {}", request.getEmail());
		User user = userRepository.findByEmail(request.getEmail())
				.orElse(null);

		if (user == null) {
			// Do not throw an exception to prevent email enumeration
			log.warn("Forgot password requested for non-existent email: {}", request.getEmail());
			return;
		}

		// Delete any existing tokens for this user
		passwordResetTokenRepository.deleteByUser(user);

		// Generate new token
		String token = UUID.randomUUID().toString();
		PasswordResetToken resetToken = PasswordResetToken.builder()
				.token(token)
				.user(user)
				.expiryDate(LocalDateTime.now().plusMinutes(15))
				.build();

		passwordResetTokenRepository.save(resetToken);

		// Construct reset URL (using a placeholder base URL for now)
		// Ideally this base URL should be in application.properties
		String resetUrl = "http://localhost:5173/reset-password?token=" + token;
		String emailText = "Hello,\n\nYou have requested to reset your password.\n" +
				"Please click the link below to set a new password:\n" +
				resetUrl + "\n\n" +
				"This link will expire in 15 minutes.\n\n" +
				"If you did not request this, please ignore this email.";

		emailService.sendEmail(user.getEmail(), "Password Reset Request", emailText);
	}

	@Override
	@Transactional
	public void processResetPassword(ResetPasswordRequest request) {
		PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		if (resetToken.isExpired()) {
			passwordResetTokenRepository.delete(resetToken);
			throw new RuntimeException("Token has expired");
		}

		User user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);

		// Clean up the used token
		passwordResetTokenRepository.delete(resetToken);
		log.info("Password successfully reset for user: {}", user.getEmail());
	}

	public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, ModelMapper modelMapper,
						   PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
	    this.userRepository = userRepository;
	    this.passwordEncoder = passwordEncoder;
	    this.modelMapper = modelMapper;
	    this.passwordResetTokenRepository = passwordResetTokenRepository;
	    this.emailService = emailService;
	}

}
