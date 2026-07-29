package com.documentcentralizer.service;

import com.documentcentralizer.dto.VerificationRequestDTO;
import com.documentcentralizer.dto.VerificationResponseDTO;
import com.documentcentralizer.entity.Document;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.entity.DocumentVerification;
import com.documentcentralizer.entity.VerificationHistory;
import com.documentcentralizer.repository.DocumentRepository;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.repository.DocumentVerificationRepository;
import com.documentcentralizer.repository.VerificationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private DocumentVerificationRepository documentVerificationRepository;

    @Autowired
    private VerificationHistoryRepository verificationHistoryRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public VerificationResponseDTO verifyDocument(Long documentId, VerificationRequestDTO requestDTO) {
        
        // Find document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

        // Find admin user
        User adminUser = userRepository.findById(requestDTO.getAdminUserId())
                .orElseThrow(() -> new RuntimeException("Admin User not found with ID: " + requestDTO.getAdminUserId()));

        // Check if there is an existing verification record
        Optional<DocumentVerification> existingVerificationOpt = documentVerificationRepository.findByDocumentId(documentId);
        
        DocumentVerification record;
        String previousStatus = null;
        String actionType = "STATUS_CHANGED";
        
        if (existingVerificationOpt.isPresent()) {
            record = existingVerificationOpt.get();
            previousStatus = record.getStatus();
            record.setVerifiedBy(adminUser);
            record.setStatus(requestDTO.getStatus());
            record.setRemarks(requestDTO.getRemarks());
            record.setRejectionReason(requestDTO.getRejectionReason());
        } else {
            record = new DocumentVerification();
            record.setDocument(document);
            record.setVerifiedBy(adminUser);
            record.setStatus(requestDTO.getStatus());
            record.setRemarks(requestDTO.getRemarks());
            record.setRejectionReason(requestDTO.getRejectionReason());
            actionType = "INITIALIZED";
        }

        // Save the active record
        DocumentVerification savedRecord = documentVerificationRepository.save(record);

        // Create and save the history record
        VerificationHistory history = new VerificationHistory();
        history.setDocument(document);
        history.setActionBy(adminUser);
        history.setAction(actionType);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(savedRecord.getStatus());
        history.setRemarks(savedRecord.getRemarks());
        history.setRejectionReason(savedRecord.getRejectionReason());
        verificationHistoryRepository.save(history);

        // Map to Response DTO manually
        VerificationResponseDTO responseDTO = new VerificationResponseDTO();
        responseDTO.setId(savedRecord.getId());
        responseDTO.setDocumentId(document.getId());
        responseDTO.setVerifiedByUserId(adminUser.getId());
        responseDTO.setStatus(savedRecord.getStatus());
        responseDTO.setRemarks(savedRecord.getRemarks());
        responseDTO.setRejectionReason(savedRecord.getRejectionReason());
        responseDTO.setCreatedAt(savedRecord.getCreatedAt());

        return responseDTO;
    }

    @Override
    public List<VerificationResponseDTO> getDocumentVerificationHistory(Long documentId) {
        List<VerificationHistory> historyRecords = verificationHistoryRepository.findByDocumentIdOrderByCreatedAtDesc(documentId);
        List<VerificationResponseDTO> responseDTOs = new ArrayList<>();

        for (VerificationHistory history : historyRecords) {
            VerificationResponseDTO dto = new VerificationResponseDTO();
            dto.setId(history.getId());
            dto.setDocumentId(history.getDocument().getId());
            dto.setVerifiedByUserId(history.getActionBy().getId());
            dto.setStatus(history.getNewStatus());
            dto.setRemarks(history.getRemarks());
            dto.setRejectionReason(history.getRejectionReason());
            dto.setCreatedAt(history.getCreatedAt());
            responseDTOs.add(dto);
        }

        return responseDTOs;
    }
}
