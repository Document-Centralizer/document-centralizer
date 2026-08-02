package com.documentcentralizer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.RequiredArgsConstructor;
import com.documentcentralizer.service.DocumentService;
import com.documentcentralizer.dto.DocumentResponseDTO;
import java.util.List;

/*
 * Class Name : SuperAdminController
 *
 * Purpose:
 * Exposes REST API endpoints for Super Admin operations.
 *
 * Responsibility:
 * - Handle high-level system management tasks and manual document review
 *
 * Author:
 * CDAC Project
 */
@RestController
@RequestMapping("/api/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
public class SuperAdminController {

    private final DocumentService documentService;

    @GetMapping("/documents/forwarded")
    public ResponseEntity<List<DocumentResponseDTO>> getForwardedDocuments() {
        List<DocumentResponseDTO> documents = documentService.getDocumentsByStatus("FORWARDED_TO_SUPERADMIN");
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/documents/{id}/verify-authbridge")
    public ResponseEntity<DocumentResponseDTO> verifyAuthBridge(@PathVariable Long id) {
        DocumentResponseDTO verifiedDocument = documentService.verifyGovernmentDocument(id);
        return ResponseEntity.ok(verifiedDocument);
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

    // Existing stubs below:
    @GetMapping("/users")
    public ResponseEntity<?> manageUsers() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admins")
    public ResponseEntity<?> manageAdmins() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        return ResponseEntity.ok().build();
    }
}
