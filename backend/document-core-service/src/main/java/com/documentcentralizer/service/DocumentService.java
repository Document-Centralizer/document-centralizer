package com.documentcentralizer.service;

import com.documentcentralizer.dto.DocumentResponseDTO;
import com.documentcentralizer.dto.DocumentUploadRequestDTO;
import com.documentcentralizer.dto.DocumentUpdateRequestDTO;
import com.documentcentralizer.dto.MyDocumentResponse;

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
     * Input: MultipartFile, DocumentUploadRequestDTO object and user ID.
     * Output: Saved DocumentResponseDTO object.
     */
    DocumentResponseDTO saveDocument(org.springframework.web.multipart.MultipartFile file, DocumentUploadRequestDTO requestDTO, Long userId);

    /*
     * Method: getAllDocuments()
     * Purpose: Retrieves all active documents.
     * Input: None.
     * Output: List of DocumentResponseDTOs.
     */
    List<DocumentResponseDTO> getAllDocuments();

    /*
     * Method: getDocumentById()
     * Purpose: Retrieves a document by its ID.
     * Input: Document ID.
     * Output: DocumentResponseDTO object.
     */
    DocumentResponseDTO getDocumentById(Long id);

    /*
     * Method: updateDocument()
     * Purpose: Updates document details.
     * Input: Document ID and updated DocumentUpdateRequestDTO object.
     * Output: Updated DocumentResponseDTO object.
     */
    DocumentResponseDTO updateDocument(Long id, DocumentUpdateRequestDTO requestDTO);

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
     * Output: List of DocumentResponseDTOs.
     */
    List<DocumentResponseDTO> getDocumentsByStatus(String status);

    /*
     * Method: getDocumentsByUser()
     * Purpose: Retrieves documents by user ID.
     * Input: User ID.
     * Output: List of DocumentResponseDTOs.
     */
    List<DocumentResponseDTO> getDocumentsByUser(Long userId);

    /*
     * Method: changeVerificationStatus()
     * Purpose: Changes the verification status of a document.
     * Input: Document ID, new status, and rejection reason (if any).
     * Output: Updated DocumentResponseDTO object.
     */
    DocumentResponseDTO changeVerificationStatus(Long id, String status, String rejectionReason);

    /*
     * Method: verifyGovernmentDocument()
     * Purpose: Verifies a government document.
     * Input: Document ID.
     * Output: Updated DocumentResponseDTO object.
     */
    DocumentResponseDTO verifyGovernmentDocument(Long id);

    /*
     * Method: getMyDocuments()
     * Purpose: Retrieves all documents uploaded by the currently logged-in user, sorted by newest first.
     * Input: User ID.
     * Output: List of MyDocumentResponse DTOs.
     */
    List<MyDocumentResponse> getMyDocuments(Long userId);
    /*
     * Method: getDashboardStats()
     * Purpose: Retrieves overall statistics for the dashboard.
     * Input: None.
     * Output: DashboardStatsDTO object.
     */
    com.documentcentralizer.dto.DashboardStatsDTO getDashboardStats();

    /*
     * Method: downloadDocumentAsResource()
     * Purpose: Loads the physical document file from storage to be downloaded.
     * Input: Document ID.
     * Output: The physical file as a Spring Resource.
     */
    org.springframework.core.io.Resource downloadDocumentAsResource(Long id);
}
