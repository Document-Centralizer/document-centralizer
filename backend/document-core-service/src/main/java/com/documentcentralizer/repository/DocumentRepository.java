package com.documentcentralizer.repository;

import com.documentcentralizer.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Interface Name : DocumentRepository
 *
 * Purpose:
 * This interface handles all database operations for the Document entity.
 *
 * Responsibility:
 * - Provide basic CRUD operations via JpaRepository
 * - Provide custom finder methods for documents
 *
 * Author:
 * CDAC Project
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // Find documents by verification status
    List<Document> findByVerificationStatus(String verificationStatus);
    
    // Find documents by verification status ordered by date
    List<Document> findByVerificationStatusOrderByUploadedAtDesc(String verificationStatus);

    // Find documents by document type
    List<Document> findByDocumentType(String documentType);

    // Find documents by deleted status
    List<Document> findByIsDeletedFalse();
    
    // Find documents by deleted status ordered by date
    List<Document> findByIsDeletedFalseOrderByUploadedAtDesc();

    // Find documents uploaded by a specific user
    List<Document> findByUserId(Long userId);

    // Find documents uploaded by a specific user, sorted by newest first
    List<Document> findByUserIdOrderByUploadedAtDesc(Long userId);


    // Check if a document with the same stored file name already exists
    boolean existsByStoredFileName(String storedFileName);

    // Count documents by verification status
    long countByVerificationStatus(String verificationStatus);

    // Count documents by user id
    long countByUserId(Long userId);

    // Count documents by user id and verification status
    long countByUserIdAndVerificationStatus(Long userId, String verificationStatus);

    // Find document by share slug
    java.util.Optional<Document> findByShareSlug(String shareSlug);

    // Get latest 5 documents
    List<Document> findTop5ByOrderByUploadedAtDesc();

    // Get storage breakdown grouped by document type
    @org.springframework.data.jpa.repository.Query("SELECT d.documentType, SUM(d.fileSize) FROM Document d GROUP BY d.documentType")
    List<Object[]> getStorageBreakdown();
}
