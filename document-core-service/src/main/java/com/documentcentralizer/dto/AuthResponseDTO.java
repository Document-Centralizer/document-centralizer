package com.documentcentralizer.dto;

import com.documentcentralizer.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Response payload after successful authentication")
public class AuthResponseDTO {

    @Schema(description = "Response message", example = "Login successful")
    private String message;

    @Schema(description = "User's email", example = "john.doe@example.com")
    private String email;

    @Schema(description = "User's assigned role", example = "USER")
    private Role role;

}
