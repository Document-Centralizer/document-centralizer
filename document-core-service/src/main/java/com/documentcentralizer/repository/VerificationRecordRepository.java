package com.documentcentralizer.repository;

import com.documentcentralizer.entity.VerificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, Long> {
    
    // Find all verification records for a specific document
    List<VerificationRecord> findByDocumentId(Long documentId);
}
