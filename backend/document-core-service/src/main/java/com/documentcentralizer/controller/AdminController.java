package com.documentcentralizer.controller;

import com.documentcentralizer.dto.DocumentResponseDTO;
import com.documentcentralizer.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Admin APIs", description = "Endpoints for administrators to manage documents and system data")
public class AdminController {

    private final DocumentService documentService;

    @Autowired
    public AdminController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @Operation(summary = "View Pending Documents", description = "Retrieves a list of all documents awaiting verification.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved pending documents"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required")
    })
    @GetMapping("/documents/pending")
    public ResponseEntity<List<DocumentResponseDTO>> getPendingDocuments() {
        List<DocumentResponseDTO> pendingDocuments = documentService.getDocumentsByStatus("PENDING");
        return ResponseEntity.ok(pendingDocuments);
    }

    @Operation(summary = "Approve Document", description = "Approves a pending document by its ID.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document approved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    @PutMapping("/documents/{id}/approve")
    public ResponseEntity<DocumentResponseDTO> approveDocument(@Parameter(description = "ID of the document to approve") @PathVariable Long id) {
        DocumentResponseDTO approvedDocument = documentService.changeVerificationStatus(id, "VERIFIED", null);
        return ResponseEntity.ok(approvedDocument);
    }

    @Operation(summary = "Reject Document", description = "Rejects a pending document by its ID with an optional reason.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document rejected successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    @PutMapping("/documents/{id}/reject")
    public ResponseEntity<DocumentResponseDTO> rejectDocument(
            @Parameter(description = "ID of the document to reject") @PathVariable Long id,
            @Parameter(description = "Reason for rejection") @RequestParam(required = false) String reason) {
        DocumentResponseDTO rejectedDocument = documentService.changeVerificationStatus(id, "REJECTED", reason);
        return ResponseEntity.ok(rejectedDocument);
    }

    @Operation(summary = "Admin Dashboard Data", description = "Retrieves overall system statistics for the admin dashboard.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok().build();
    }
}
