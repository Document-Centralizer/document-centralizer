package com.documentcentralizer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Payload for uploading a new document")
public class DocumentUploadRequestDTO {

    @NotBlank(message = "Document name is required")
    @Schema(description = "Name of the document provided by user", example = "Resume 2024", requiredMode = Schema.RequiredMode.REQUIRED)
    private String documentName;

    @NotBlank(message = "Document type is required")
    @Schema(description = "Category or type of the document", example = "RESUME", requiredMode = Schema.RequiredMode.REQUIRED)
    private String documentType;

    @Schema(description = "Additional remarks for the document", example = "Please review urgently")
    private String remarks;
}
