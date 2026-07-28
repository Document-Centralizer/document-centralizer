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
public class Document extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String documentName;

    @Column(nullable = false, length = 50)
    private String documentType;

    @Column(nullable = false, length = 255)
    private String originalFileName;

    @Column(nullable = false, unique = true, length = 255)
    private String storedFileName;

    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 50)
    private String fileFormat;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    @Column(nullable = false, length = 50)
    private String verificationStatus; // Example: PENDING, VERIFIED, REJECTED

    @Column(length = 255)
    private String rejectionReason;

    @Column(length = 255)
    private String remarks;

    @Column(nullable = false)
    private Boolean isDeleted = false;

    // Many documents belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
