package com.documentcentralizer.controller;

import com.documentcentralizer.dto.VerificationRequestDTO;
import com.documentcentralizer.dto.VerificationResponseDTO;
import com.documentcentralizer.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    // Verify a document
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping("/{documentId}/verify")
    public ResponseEntity<VerificationResponseDTO> verifyDocument(
            @PathVariable Long documentId,
            @RequestBody VerificationRequestDTO requestDTO) {
        
        VerificationResponseDTO response = verificationService.verifyDocument(documentId, requestDTO);
        return ResponseEntity.ok(response);
    }

    // Approve a document
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping("/{documentId}/approve")
    public ResponseEntity<VerificationResponseDTO> approveDocument(
            @PathVariable Long documentId,
            @RequestBody VerificationRequestDTO requestDTO) {
        
        VerificationResponseDTO response = verificationService.approveDocument(documentId, requestDTO);
        return ResponseEntity.ok(response);
    }

    // Get verification history for a document
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'USER')")
    @GetMapping("/{documentId}/history")
    public ResponseEntity<List<VerificationResponseDTO>> getVerificationHistory(
            @PathVariable Long documentId) {
        
        List<VerificationResponseDTO> history = verificationService.getDocumentVerificationHistory(documentId);
        return ResponseEntity.ok(history);
    }
}
