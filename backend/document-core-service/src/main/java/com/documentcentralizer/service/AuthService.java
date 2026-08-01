package com.documentcentralizer.service;

import com.documentcentralizer.dto.AuthResponseDTO;
import com.documentcentralizer.dto.LoginRequestDTO;
import com.documentcentralizer.dto.RegisterRequestDTO;

public interface AuthService {
	AuthResponseDTO register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);

    void processForgotPassword(com.documentcentralizer.dto.ForgotPasswordRequest request);

    void processResetPassword(com.documentcentralizer.dto.ResetPasswordRequest request);
}
