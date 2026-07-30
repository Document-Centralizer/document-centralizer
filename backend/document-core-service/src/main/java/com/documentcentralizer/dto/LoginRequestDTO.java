package com.documentcentralizer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "Request payload for user login")
public class LoginRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Enter valid email")
    @Schema(description = "User's registered email", example = "john.doe@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "User's password", example = "StrongP@ss123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

}
