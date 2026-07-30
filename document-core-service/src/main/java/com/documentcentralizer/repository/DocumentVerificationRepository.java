package com.documentcentralizer.repository;

import com.documentcentralizer.entity.DocumentVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentVerificationRepository extends JpaRepository<DocumentVerification, Long> {
    
    // Find verification record for a specific document
    Optional<DocumentVerification> findByDocumentId(Long documentId);
}
