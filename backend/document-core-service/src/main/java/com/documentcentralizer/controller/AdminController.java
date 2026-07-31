package com.documentcentralizer.controller;

import com.documentcentralizer.dto.DocumentResponseDTO;
import com.documentcentralizer.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Class Name : AdminController
 *
 * Purpose:
 * Exposes REST API endpoints for Admin operations.
 *
 * Responsibility:
 * - Handle administrative tasks like document approval and rejection
 *
 * Author:
 * CDAC Project
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DocumentService documentService;

    @Autowired
    public AdminController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/documents/pending")
    public ResponseEntity<List<DocumentResponseDTO>> getPendingDocuments() {
        List<DocumentResponseDTO> pendingDocuments = documentService.getDocumentsByStatus("PENDING");
        return ResponseEntity.ok(pendingDocuments);
    }

    @PutMapping("/documents/{id}/approve")
    public ResponseEntity<DocumentResponseDTO> approveDocument(@PathVariable Long id) {
        DocumentResponseDTO approvedDocument = documentService.changeVerificationStatus(id, "VERIFIED", null);
        return ResponseEntity.ok(approvedDocument);
    }

    @PutMapping("/documents/{id}/reject")
    public ResponseEntity<DocumentResponseDTO> rejectDocument(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        DocumentResponseDTO rejectedDocument = documentService.changeVerificationStatus(id, "REJECTED", reason);
        return ResponseEntity.ok(rejectedDocument);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok().build();
    }
}
