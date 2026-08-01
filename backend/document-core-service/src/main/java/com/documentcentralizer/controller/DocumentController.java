package com.documentcentralizer.controller;

import com.documentcentralizer.dto.ApiResponse;
import com.documentcentralizer.dto.DocumentResponseDTO;
import com.documentcentralizer.dto.DocumentUploadRequestDTO;
import com.documentcentralizer.dto.DocumentUpdateRequestDTO;
import com.documentcentralizer.dto.MyDocumentResponse;
import com.documentcentralizer.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
@RequiredArgsConstructor
@RequestMapping("/api/documents")
@Tag(name = "Document APIs", description = "Endpoints for document management operations like upload, view, update, and search.")
@SecurityRequirement(name = "bearerAuth")
public class DocumentController {

    private final DocumentService documentService;


    /*
     * Method : uploadDocument()
     * Purpose: Upload a document, validate the request, and store its metadata.
     */
    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<DocumentResponseDTO>> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestParam("documentName") String documentName,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam("userId") Long userId) {
            
            DocumentUploadRequestDTO requestDTO = new DocumentUploadRequestDTO();
            requestDTO.setDocumentName(documentName);
            requestDTO.setDocumentType(documentType);
            requestDTO.setRemarks(remarks);

    		DocumentResponseDTO response =
                documentService.saveDocument(file, requestDTO, userId);

        ApiResponse<DocumentResponseDTO> apiResponse = new ApiResponse<>(true, "Document uploaded successfully.", response);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    /*
     * Method: getAllDocuments()
     * Purpose: API endpoint to fetch all active documents.
     */
    @Operation(summary = "View Documents", description = "Retrieves a list of all active (non-deleted) documents.", security = @SecurityRequirement(name = "bearerAuth"))

    @GetMapping("/")
    public ResponseEntity<List<DocumentResponseDTO>> getAllDocuments() {
        
        // Fetch all documents and return OK status
        List<DocumentResponseDTO> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: getDocumentById()
     * Purpose: API endpoint to fetch a document by its ID.
     */
    @Operation(summary = "View Document by ID", description = "Retrieves the details of a specific document by its ID.", security = @SecurityRequirement(name = "bearerAuth"))

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDTO> getDocumentById(
            @Parameter(description = "ID of the document to retrieve") @PathVariable Long id) {
        
        // Fetch document by ID and return OK status
        DocumentResponseDTO document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    /*
     * Method: updateDocument()
     * Purpose: API endpoint to update document details.
     */
    @Operation(summary = "Update Document", description = "Updates metadata (like name, remarks) of an existing document.", security = @SecurityRequirement(name = "bearerAuth"))

    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponseDTO> updateDocument(
            @Parameter(description = "ID of the document to update") @PathVariable Long id,
            @Parameter(description = "Updated document details payload") @Valid @RequestBody DocumentUpdateRequestDTO requestDTO) {
        
        // Update document and return OK status
        DocumentResponseDTO updatedDocument = documentService.updateDocument(id, requestDTO);
        return ResponseEntity.ok(updatedDocument);
    }

    /*
     * Method: deleteDocument()
     * Purpose: API endpoint to softly delete a document.
     */
    @Operation(summary = "Delete Document", description = "Performs a soft delete on a document by its ID.", security = @SecurityRequirement(name = "bearerAuth"))

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

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByStatus(
            @Parameter(description = "Verification status (e.g., PENDING, VERIFIED, REJECTED)") @PathVariable String status) {
        
        // Fetch documents by status and return OK
        List<DocumentResponseDTO> documents = documentService.getDocumentsByStatus(status);
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: getDocumentsByUser()
     * Purpose: API endpoint to fetch all documents uploaded by a user.
     */
    @Operation(summary = "Search Documents by User", description = "Retrieves all documents uploaded by a specific user.", security = @SecurityRequirement(name = "bearerAuth"))

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByUser(
            @Parameter(description = "ID of the user whose documents to retrieve") @PathVariable Long userId) {
        
        // Fetch user's documents and return OK
        List<DocumentResponseDTO> documents = documentService.getDocumentsByUser(userId);
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: verifyDocument()
     * Purpose: API endpoint to approve or reject a document.
     */
    @Operation(summary = "Verify Document", description = "Approves or rejects a document. If rejecting, a reason can be provided.", security = @SecurityRequirement(name = "bearerAuth"))

    @PutMapping("/verify/{id}")
    public ResponseEntity<DocumentResponseDTO> verifyDocument(
            @Parameter(description = "ID of the document to verify") @PathVariable Long id,
            @Parameter(description = "New verification status (VERIFIED or REJECTED)") @RequestParam String status,
            @Parameter(description = "Reason for rejection (if status is REJECTED)") @RequestParam(required = false) String rejectionReason) {
        
        // Change verification status and return OK
        DocumentResponseDTO updatedDocument = documentService.changeVerificationStatus(id, status, rejectionReason);
        return ResponseEntity.ok(updatedDocument);
    }

    @Operation(summary = "Download Document", description = "Downloads a document file by its ID.", security = @SecurityRequirement(name = "bearerAuth"))

    @GetMapping("/{id}/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@Parameter(description = "ID of the document to download") @PathVariable Long id) {
        
        // 1. Get the physical file resource from the service
        org.springframework.core.io.Resource resource = documentService.downloadDocumentAsResource(id);
        
        // 2. Fetch the document details to get its original name
        DocumentResponseDTO documentDetails = documentService.getDocumentById(id);
        
        // 3. Prepare the HTTP header to tell the browser this is an attachment
        String headerValue = "attachment; filename=\"" + documentDetails.getOriginalFileName() + "\"";
        
        // 4. Send the file to the user
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, headerValue)
                .body(resource);
    }

    /*
     * Method: getMyDocuments()
     * Purpose: Retrieve all documents uploaded by the currently logged-in user.
     * Input: User ID from X-USER-ID header (Temporary until JWT is integrated).
     * Output: JSON array of MyDocumentResponse objects.
     * Processing: Passes user ID to service layer and returns DTOs.
     */
    @Operation(summary = "Get My Documents", description = "Retrieves all documents uploaded by the currently logged-in user.", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/my")
    public ResponseEntity<List<MyDocumentResponse>> getMyDocuments(
            @Parameter(description = "User ID (Temporary Header)") @RequestHeader("X-USER-ID") Long userId) {

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<MyDocumentResponse> myDocuments = documentService.getMyDocuments(userId);
        
        return ResponseEntity.ok(myDocuments);
    }
}
