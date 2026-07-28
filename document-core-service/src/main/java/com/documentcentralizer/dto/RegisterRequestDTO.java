package com.documentcentralizer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "Request payload for user registration")
public class RegisterRequestDTO {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    @Schema(description = "User's first name", example = "John", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    @Schema(description = "User's last name", example = "Doe", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    @Schema(description = "User's email address", example = "john.doe@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$",
             message = "Enter valid 10 digit mobile number")
    @Schema(description = "User's 10-digit mobile number", example = "9876543210", requiredMode = Schema.RequiredMode.REQUIRED)
    private String mobileNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8,
          max = 20,
          message = "Password must be between 8 and 20 characters")
    @Schema(description = "User's secure password", example = "StrongP@ss123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

}
