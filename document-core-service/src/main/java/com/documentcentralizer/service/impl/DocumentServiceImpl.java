package com.documentcentralizer.service.impl;

import com.documentcentralizer.entity.Document;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.repository.DocumentRepository;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.service.DocumentService;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * Class Name : DocumentServiceImpl
 *
 * Purpose:
 * This class contains the business logic related to documents.
 *
 * Responsibility:
 * - Save document information
 * - Fetch document details
 * - Update document details
 * - Delete document records
 *
 * Author:
 * CDAC Project
 */
@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    // Constructor Injection
    public DocumentServiceImpl(DocumentRepository documentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    /*
     * Method: saveDocument()
     * Purpose: Saves document details into the database.
     * Input: Document object received from controller and user ID.
     * Output: Saved Document object.
     * Processing:
     * - Check if document with same stored name exists
     * - Validate user exists
     * - Set default status
     * - Save document using repository
     * - Return saved entity
     */
    @Override
    public Document saveDocument(Document document, Long userId) {
        // Check whether document with same stored name exists
        if (documentRepository.existsByStoredFileName(document.getStoredFileName())) {
            throw new RuntimeException("Document with this stored file name already exists");
        }

        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Assign user to document
        document.setUser(user);

        // Set default values for new document
        document.setVerificationStatus("PENDING");
        document.setIsDeleted(false);

        // Save document in database
        return documentRepository.save(document);
    }

    /*
     * Method: getAllDocuments()
     * Purpose: Retrieves all active documents from the system.
     * Input: None.
     * Output: List of active Document objects.
     * Processing:
     * - Fetch all documents where isDeleted is false
     */
    @Override
    public List<Document> getAllDocuments() {
        // Fetch and return active documents
        return documentRepository.findByIsDeletedFalse();
    }

    /*
     * Method: getDocumentById()
     * Purpose: Retrieves specific document details by ID.
     * Input: Document ID.
     * Output: Document object.
     * Processing:
     * - Fetch document by ID
     * - Throw exception if not found or if it is deleted
     */
    @Override
    public Document getDocumentById(Long id) {
        // Fetch document by id
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));

        // Check if document is deleted
        if (document.getIsDeleted()) {
            throw new RuntimeException("Document is deleted");
        }

        // Return fetched document
        return document;
    }

    /*
     * Method: updateDocument()
     * Purpose: Updates document metadata.
     * Input: Document ID and updated Document details.
     * Output: Updated Document object.
     * Processing:
     * - Find existing document
     * - Update allowed fields
     * - Save to repository
     */
    @Override
    public Document updateDocument(Long id, Document documentDetails) {
        // Find existing document
        Document existingDocument = getDocumentById(id);

        // Update only editable fields
        existingDocument.setDocumentName(documentDetails.getDocumentName());
        existingDocument.setRemarks(documentDetails.getRemarks());

        // Save updated document in database
        return documentRepository.save(existingDocument);
    }

    /*
     * Method: deleteDocument()
     * Purpose: Performs soft delete on a document.
     * Input: Document ID.
     * Output: None.
     * Processing:
     * - Fetch document by ID
     * - Set isDeleted to true
     * - Save document
     */
    @Override
    public void deleteDocument(Long id) {
        // Find existing document
        Document document = getDocumentById(id);

        // Soft delete the record
        document.setIsDeleted(true);

        // Save the updated record
        documentRepository.save(document);
    }

    /*
     * Method: getDocumentsByStatus()
     * Purpose: Retrieves documents by their verification status.
     * Input: Status string.
     * Output: List of Document objects.
     */
    @Override
    public List<Document> getDocumentsByStatus(String status) {
        // Return documents matching the status
        return documentRepository.findByVerificationStatus(status);
    }

    /*
     * Method: getDocumentsByUser()
     * Purpose: Retrieves all documents uploaded by a specific user.
     * Input: User ID.
     * Output: List of Document objects.
     */
    @Override
    public List<Document> getDocumentsByUser(Long userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        // Return user's documents
        return documentRepository.findByUserId(userId);
    }

    /*
     * Method: changeVerificationStatus()
     * Purpose: Approves or rejects a document.
     * Input: Document ID, new status, rejection reason.
     * Output: Updated Document object.
     * Processing:
     * - Fetch document
     * - Update status and rejection reason (if rejected)
     * - Save to repository
     */
    @Override
    public Document changeVerificationStatus(Long id, String status, String rejectionReason) {
        // Find existing document
        Document document = getDocumentById(id);

        // Update verification status
        document.setVerificationStatus(status);

        // Set rejection reason if status is REJECTED
        if ("REJECTED".equalsIgnoreCase(status)) {
            document.setRejectionReason(rejectionReason);
        } else {
            document.setRejectionReason(null);
        }

        // Save updated document in database
        return documentRepository.save(document);
    }
}
