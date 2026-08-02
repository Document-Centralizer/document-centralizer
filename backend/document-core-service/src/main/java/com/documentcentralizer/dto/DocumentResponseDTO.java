package com.documentcentralizer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "Response containing document details")
public class DocumentResponseDTO {

    @Schema(description = "Internal document ID", example = "1")
    private Long id;

    @Schema(description = "Name of the document", example = "Resume 2024")
    private String documentName;

    @Schema(description = "Type/Category of document", example = "RESUME")
    private String documentType;

    @Schema(description = "Original name of the uploaded file", example = "john_doe_resume.pdf")
    private String originalFileName;

    @Schema(description = "Unique stored file name", example = "1722135043_john_doe_resume.pdf")
    private String storedFileName;

    @Schema(description = "S3 object key for the file", example = "documents/pdf/1722135043_john_doe_resume.pdf")
    private String objectKey;

    @Schema(description = "Size of the file in bytes", example = "1048576")
    private Long fileSize;

    @Schema(description = "Format of the file", example = "application/pdf")
    private String contentType;

    @Schema(description = "Timestamp when uploaded")
    private LocalDateTime uploadedAt;

    @Schema(description = "Verification status", example = "PENDING_ADMIN")
    private String verificationStatus;

    @Schema(description = "Reason for rejection if REJECTED", example = "Unreadable")
    private String rejectionReason;

    @Schema(description = "Additional remarks", example = "Please review")
    private String remarks;

    @Schema(description = "OCR extracted text from the document")
    private String ocrText;

    @Schema(description = "ID of the user who uploaded the document", example = "5")
    private Long userId;

    @Schema(description = "Admin remarks", example = "Approved after review")
    private String adminRemark;

    @Schema(description = "Unique slug for sharing", example = "abc123xyz")
    private String shareSlug;
}
