package com.documentcentralizer.service;

import com.documentcentralizer.dto.VerificationRequestDTO;
import com.documentcentralizer.dto.VerificationResponseDTO;

import java.util.List;

public interface VerificationService {
    
    VerificationResponseDTO verifyDocument(Long documentId, VerificationRequestDTO requestDTO);
    
    List<VerificationResponseDTO> getDocumentVerificationHistory(Long documentId);
}
