package com.documentcentralizer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Payload for updating document metadata")
public class DocumentUpdateRequestDTO {

    @Schema(description = "Updated name of the document", example = "Resume 2024 Final")
    private String documentName;

    @Schema(description = "Updated remarks for the document", example = "Updated resume attached")
    private String remarks;
}
