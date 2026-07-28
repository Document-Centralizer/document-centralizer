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

    // Find documents by document type
    List<Document> findByDocumentType(String documentType);

    // Find documents uploaded by a specific user
    List<Document> findByUserId(Long userId);

    // Find all active (not deleted) documents
    List<Document> findByIsDeletedFalse();

    // Check if a document with the same stored file name already exists
    boolean existsByStoredFileName(String storedFileName);
}
