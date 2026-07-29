package com.documentcentralizer.repository;

import com.documentcentralizer.entity.VerificationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationHistoryRepository extends JpaRepository<VerificationHistory, Long> {
    List<VerificationHistory> findByDocumentIdOrderByCreatedAtDesc(Long documentId);
}
