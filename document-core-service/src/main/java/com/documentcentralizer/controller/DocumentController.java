package com.documentcentralizer.controller;

import com.documentcentralizer.entity.Document;
import com.documentcentralizer.service.DocumentService;
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
public class DocumentController {

    private final DocumentService documentService;

    // Constructor Injection
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /*
     * Method: uploadDocument()
     * Purpose: API endpoint to upload a new document.
     * Input: Document details and user ID as a request parameter.
     * Output: ResponseEntity with saved Document object and HTTP status.
     */
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestBody Document document,
            @RequestParam Long userId) {
        
        // Save document and return CREATED status
        Document savedDocument = documentService.saveDocument(document, userId);
        return new ResponseEntity<>(savedDocument, HttpStatus.CREATED);
    }

    /*
     * Method: getAllDocuments()
     * Purpose: API endpoint to fetch all active documents.
     * Input: None.
     * Output: ResponseEntity with a list of Document objects.
     */
    @GetMapping("/")
    public ResponseEntity<List<Document>> getAllDocuments() {
        
        // Fetch all documents and return OK status
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: getDocumentById()
     * Purpose: API endpoint to fetch a document by its ID.
     * Input: Document ID from URL path.
     * Output: ResponseEntity with the Document object.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        
        // Fetch document by ID and return OK status
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    /*
     * Method: updateDocument()
     * Purpose: API endpoint to update document details.
     * Input: Document ID from URL and updated Document object from request body.
     * Output: ResponseEntity with updated Document object.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestBody Document documentDetails) {
        
        // Update document and return OK status
        Document updatedDocument = documentService.updateDocument(id, documentDetails);
        return ResponseEntity.ok(updatedDocument);
    }

    /*
     * Method: deleteDocument()
     * Purpose: API endpoint to softly delete a document.
     * Input: Document ID from URL path.
     * Output: ResponseEntity with success message and OK status.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        
        // Delete document and return success message
        documentService.deleteDocument(id);
        return new ResponseEntity<>("Document deleted successfully", HttpStatus.OK);
    }

    /*
     * Method: getDocumentsByStatus()
     * Purpose: API endpoint to fetch documents by verification status.
     * Input: Status string from URL path.
     * Output: ResponseEntity with list of matching Document objects.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Document>> getDocumentsByStatus(@PathVariable String status) {
        
        // Fetch documents by status and return OK
        List<Document> documents = documentService.getDocumentsByStatus(status);
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: getDocumentsByUser()
     * Purpose: API endpoint to fetch all documents uploaded by a user.
     * Input: User ID from URL path.
     * Output: ResponseEntity with list of user's Document objects.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getDocumentsByUser(@PathVariable Long userId) {
        
        // Fetch user's documents and return OK
        List<Document> documents = documentService.getDocumentsByUser(userId);
        return ResponseEntity.ok(documents);
    }

    /*
     * Method: verifyDocument()
     * Purpose: API endpoint to approve or reject a document.
     * Input: Document ID from URL, new status and reason as request parameters.
     * Output: ResponseEntity with updated Document object.
     */
    @PutMapping("/verify/{id}")
    public ResponseEntity<Document> verifyDocument(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason) {
        
        // Change verification status and return OK
        Document updatedDocument = documentService.changeVerificationStatus(id, status, rejectionReason);
        return ResponseEntity.ok(updatedDocument);
    }
}
