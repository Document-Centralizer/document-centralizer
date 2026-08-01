package com.documentcentralizer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "Request payload for refreshing JWT token")
public class RefreshTokenRequestDTO {
    @NotBlank(message = "Refresh token is required")
    @Schema(description = "Valid refresh token", requiredMode = Schema.RequiredMode.REQUIRED)
    private String refreshToken;
}
