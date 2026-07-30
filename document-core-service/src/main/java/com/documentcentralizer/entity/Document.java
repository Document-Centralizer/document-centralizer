package com.documentcentralizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

import io.swagger.v3.oas.annotations.media.Schema;

/*
 * Class Name : Document
 *
 * Purpose:
 * This class represents the Document entity which maps to the "documents" table in the database.
 *
 * Responsibility:
 * - Hold document related information like file name, path, status, etc.
 * - Establish relationship with the User entity.
 *
 * Author:
 * CDAC Project
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
    @Schema(description = "Physical or cloud path to the stored file", example = "/uploads/documents/1722135043_john_doe_resume.pdf")
    private String filePath;

    @Column(nullable = false)
    @Schema(description = "Size of the file in bytes", example = "1048576")
    private Long fileSize;

    @Column(nullable = false, length = 50)
    @Schema(description = "Format of the file", example = "application/pdf")
    private String fileFormat;

    @CreationTimestamp
    @Column(updatable = false)
    @Schema(description = "Timestamp when the document was uploaded")
    private LocalDateTime uploadedAt;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private DocumentVerification documentVerification;

    @Column(nullable = false)
    @Schema(description = "Soft delete flag", example = "false")
    private Boolean isDeleted = false;

    // Many documents belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(hidden = true) // Hide from Swagger to prevent recursion/clutter
    private User user;

}
