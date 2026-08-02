package com.documentcentralizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Represents the Document entity, mapping to the "documents" table.
 * Holds file metadata, status, and establishes a relationship with User.
 */
@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Represents a document in the system")
public class Document extends BaseEntity {

    @Column(nullable = false, length = 100)
    @Schema(description = "Name of the document provided by user", example = "Resume 2024", requiredMode = Schema.RequiredMode.REQUIRED)
    private String documentName;

    @Column(nullable = false, length = 50)
    @Schema(description = "Category or type of the document", example = "RESUME", requiredMode = Schema.RequiredMode.REQUIRED)
    private String documentType;

    @Column(nullable = false, length = 255)
    @Schema(description = "Original name of the uploaded file", example = "john_doe_resume.pdf")
    private String originalFileName;

    @Column(nullable = false, unique = true, length = 255)
    @Schema(description = "Unique stored file name in the file system", example = "1722135043_john_doe_resume.pdf")
    private String storedFileName;

    @Column(nullable = false, length = 500)
    @Schema(description = "S3 object key for the file", example = "documents/pdf/1722135043_john_doe_resume.pdf")
    private String objectKey;

    @Column(nullable = false)
    @Schema(description = "Size of the file in bytes", example = "1048576")
    private Long fileSize;

    @Column(nullable = false, length = 50)
    @Schema(description = "Format of the file", example = "application/pdf")
    private String contentType;

    @CreationTimestamp
    @Column(updatable = false)
    @Schema(description = "Timestamp when the document was uploaded")
    private LocalDateTime uploadedAt;

    @Column(nullable = false, length = 50)
    @Schema(description = "Verification status of the document", example = "PENDING")
    private String verificationStatus; // Example: PENDING, VERIFIED, REJECTED

    @Column(length = 255)
    @Schema(description = "Reason for rejection if status is REJECTED", example = "Document is unreadable")
    private String rejectionReason;

    @Column(length = 255)
    @Schema(description = "Additional remarks for the document", example = "Please review urgently")
    private String remarks;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "OCR extracted text from the document")
    private String ocrText;

    @Column(nullable = false)
    @Schema(description = "Soft delete flag", example = "false")
    private Boolean isDeleted = false;

    @Column(length = 255)
    @Schema(description = "Admin remarks for the document", example = "Approved after review")
    private String adminRemark;

    @Column(length = 255, unique = true)
    @Schema(description = "Unique slug for sharing the document publicly", example = "abc123xyz")
    private String shareSlug;

    // Many documents belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(hidden = true) // Hide from Swagger to prevent recursion/clutter
    private User user;

}
