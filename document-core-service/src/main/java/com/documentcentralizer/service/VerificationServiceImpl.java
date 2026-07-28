package com.documentcentralizer.service;

import com.documentcentralizer.dto.VerificationRequestDTO;
import com.documentcentralizer.dto.VerificationResponseDTO;
import com.documentcentralizer.entity.Document;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.entity.VerificationRecord;
import com.documentcentralizer.repository.DocumentRepository;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.repository.VerificationRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private VerificationRecordRepository verificationRecordRepository;

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

        // Create new verification record
        VerificationRecord record = new VerificationRecord();
        record.setDocument(document);
        record.setVerifiedBy(adminUser);
        record.setStatus(requestDTO.getStatus());
        record.setRemarks(requestDTO.getRemarks());
        record.setRejectionReason(requestDTO.getRejectionReason());

        // Save the record
        VerificationRecord savedRecord = verificationRecordRepository.save(record);

        // Update the document itself
        document.setVerificationStatus(requestDTO.getStatus());
        document.setRemarks(requestDTO.getRemarks());
        document.setRejectionReason(requestDTO.getRejectionReason());
        documentRepository.save(document);

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
        List<VerificationRecord> records = verificationRecordRepository.findByDocumentId(documentId);
        List<VerificationResponseDTO> responseDTOs = new ArrayList<>();

        for (VerificationRecord record : records) {
            VerificationResponseDTO dto = new VerificationResponseDTO();
            dto.setId(record.getId());
            dto.setDocumentId(record.getDocument().getId());
            dto.setVerifiedByUserId(record.getVerifiedBy().getId());
            dto.setStatus(record.getStatus());
            dto.setRemarks(record.getRemarks());
            dto.setRejectionReason(record.getRejectionReason());
            dto.setCreatedAt(record.getCreatedAt());
            responseDTOs.add(dto);
        }

        return responseDTOs;
    }
}
