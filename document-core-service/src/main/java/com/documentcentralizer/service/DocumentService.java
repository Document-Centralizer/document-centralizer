package com.documentcentralizer.service;

import com.documentcentralizer.entity.Document;
import java.util.List;

/*
 * Interface Name : DocumentService
 *
 * Purpose:
 * This interface defines the business logic operations for Document entity.
 *
 * Responsibility:
 * - Declare methods for document operations like save, get, update, delete
 * - Act as a contract for the implementation class
 *
 * Author:
 * CDAC Project
 */
public interface DocumentService {

    /*
     * Method: saveDocument()
     * Purpose: Saves a new document into the system.
     * Input: Document object and user ID.
     * Output: Saved Document object.
     */
    Document saveDocument(Document document, Long userId);

    /*
     * Method: getAllDocuments()
     * Purpose: Retrieves all active documents.
     * Input: None.
     * Output: List of active documents.
     */
    List<Document> getAllDocuments();

    /*
     * Method: getDocumentById()
     * Purpose: Retrieves a document by its ID.
     * Input: Document ID.
     * Output: Document object.
     */
    Document getDocumentById(Long id);

    /*
     * Method: updateDocument()
     * Purpose: Updates document details.
     * Input: Document ID and updated Document object.
     * Output: Updated Document object.
     */
    Document updateDocument(Long id, Document documentDetails);

    /*
     * Method: deleteDocument()
     * Purpose: Deletes a document by ID.
     * Input: Document ID.
     * Output: None.
     */
    void deleteDocument(Long id);

    /*
     * Method: getDocumentsByStatus()
     * Purpose: Retrieves documents by verification status.
     * Input: Status string.
     * Output: List of Documents.
     */
    List<Document> getDocumentsByStatus(String status);

    /*
     * Method: getDocumentsByUser()
     * Purpose: Retrieves documents by user ID.
     * Input: User ID.
     * Output: List of Documents.
     */
    List<Document> getDocumentsByUser(Long userId);

    /*
     * Method: changeVerificationStatus()
     * Purpose: Changes the verification status of a document.
     * Input: Document ID, new status, and rejection reason (if any).
     * Output: Updated Document object.
     */
    Document changeVerificationStatus(Long id, String status, String rejectionReason);
}
