package com.documentcentralizer.controller;

import com.documentcentralizer.dto.DocumentResponseDTO;
import com.documentcentralizer.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

/*
 * Class Name : AdminController
 *
 * Purpose:
 * Exposes REST API endpoints for Admin operations.
 *
 * Responsibility:
 * - Handle administrative tasks like document approval and rejection
 */
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')") // Allow both Admin and SuperAdmin
@RequiredArgsConstructor
public class AdminController {

    private final DocumentService documentService;


    @GetMapping("/documents/pending")
    public ResponseEntity<List<DocumentResponseDTO>> getPendingDocuments() {
        List<DocumentResponseDTO> pendingDocuments = documentService.getDocumentsByStatus("PENDING_ADMIN");
        return ResponseEntity.ok(pendingDocuments);
    }

    @PutMapping("/documents/{id}/reject")
    public ResponseEntity<DocumentResponseDTO> rejectDocument(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        DocumentResponseDTO rejectedDocument = documentService.changeVerificationStatus(id, "REJECTED", reason);
        return ResponseEntity.ok(rejectedDocument);
    }

    @PutMapping("/documents/{id}/forward")
    public ResponseEntity<DocumentResponseDTO> forwardDocument(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks) {
        DocumentResponseDTO forwardedDocument = documentService.changeVerificationStatus(id, "FORWARDED_TO_SUPERADMIN", remarks);
        return ResponseEntity.ok(forwardedDocument);
    }



    @GetMapping("/dashboard")
    public ResponseEntity<com.documentcentralizer.dto.DashboardStatsDTO> getDashboard() {
        return ResponseEntity.ok(documentService.getDashboardStats());
    }
}
