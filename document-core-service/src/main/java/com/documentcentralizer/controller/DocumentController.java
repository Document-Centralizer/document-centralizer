package com.documentcentralizer.controller;

import com.documentcentralizer.entity.Document;
import com.documentcentralizer.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Class Name : DocumentController
 *
 * Purpose:
 * This class exposes REST API endpoints for document operations.
 *
 * Responsibility:
 * - Handle HTTP requests related to documents
 * - Delegate business logic to DocumentService
 * - Return proper HTTP responses to the client
 *
 * Author:
 * CDAC Project
 */
@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document APIs", description = "Endpoints for document management operations like upload, view, update, and search.")
public class DocumentController {

    private final DocumentService documentService;

    // Constructor Injection
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /*
     * Method: uploadDocument()
     * Purpose: API endpoint to upload a new document.
     */
    @Operation(summary = "Upload Document", description = "Uploads a new document to the system.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Document uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "409", description = "Document with same name already exists")
    })
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @Parameter(description = "Document details payload") @RequestBody Document document,
            @Parameter(description = "ID of the user uploading the document") @RequestParam Long userId) {
        
        // Save document and return CREATED status
        Document savedDocument = documentService.saveDocument(document, userId);
        return new ResponseEntity<>(savedDocument, HttpStatus.CREATED);
    }

    /*
     * Method: getAllDocuments()
     * Purpose: API endpoint to fetch all active documents.
     */
    @Operation(summary = "View Documents", description = "Retrieves a list of all active (non-deleted) documents.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved documents"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @GetMapping("/")
    public ResponseEntity<List<Document>> getAllDocuments() {
        
        // Fetch all documents and return OK status
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: getDocumentById()
     * Purpose: API endpoint to fetch a document by its ID.
     */
    @Operation(summary = "View Document by ID", description = "Retrieves the details of a specific document by its ID.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved document"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(
            @Parameter(description = "ID of the document to retrieve") @PathVariable Long id) {
        
        // Fetch document by ID and return OK status
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    /*
     * Method: updateDocument()
     * Purpose: API endpoint to update document details.
     */
    @Operation(summary = "Update Document", description = "Updates metadata (like name, remarks) of an existing document.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @Parameter(description = "ID of the document to update") @PathVariable Long id,
            @Parameter(description = "Updated document details payload") @RequestBody Document documentDetails) {
        
        // Update document and return OK status
        Document updatedDocument = documentService.updateDocument(id, documentDetails);
        return ResponseEntity.ok(updatedDocument);
    }

    /*
     * Method: deleteDocument()
     * Purpose: API endpoint to softly delete a document.
     */
    @Operation(summary = "Delete Document", description = "Performs a soft delete on a document by its ID.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Document deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(
            @Parameter(description = "ID of the document to delete") @PathVariable Long id) {
        
        // Delete document and return success message
        documentService.deleteDocument(id);
        return new ResponseEntity<>("Document deleted successfully", HttpStatus.OK);
    }

    /*
     * Method: getDocumentsByStatus()
     * Purpose: API endpoint to fetch documents by verification status.
     */
    @Operation(summary = "Search Documents by Status", description = "Retrieves documents filtered by their verification status.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved documents"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Document>> getDocumentsByStatus(
            @Parameter(description = "Verification status (e.g., PENDING, VERIFIED, REJECTED)") @PathVariable String status) {
        
        // Fetch documents by status and return OK
        List<Document> documents = documentService.getDocumentsByStatus(status);
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: getDocumentsByUser()
     * Purpose: API endpoint to fetch all documents uploaded by a user.
     */
    @Operation(summary = "Search Documents by User", description = "Retrieves all documents uploaded by a specific user.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user documents"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getDocumentsByUser(
            @Parameter(description = "ID of the user whose documents to retrieve") @PathVariable Long userId) {
        
        // Fetch user's documents and return OK
        List<Document> documents = documentService.getDocumentsByUser(userId);
        return ResponseEntity.ok(documents);
    }

    @Operation(summary = "Download Document", description = "Downloads a document file by its ID.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File downloaded successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocument(@Parameter(description = "ID of the document to download") @PathVariable Long id) {
        // Stub for download document functionality requested in Swagger requirements
        return ResponseEntity.ok().build();
    }
}
