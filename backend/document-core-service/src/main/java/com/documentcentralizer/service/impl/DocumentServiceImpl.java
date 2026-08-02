package com.documentcentralizer.service.impl;

import com.documentcentralizer.dto.DocumentResponseDTO;
import com.documentcentralizer.dto.DocumentUploadRequestDTO;
import com.documentcentralizer.dto.DocumentUpdateRequestDTO;
import com.documentcentralizer.dto.MyDocumentResponse;
import com.documentcentralizer.entity.Document;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.repository.DocumentRepository;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.service.DocumentService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/*
 * Class Name : DocumentServiceImpl
 *
 * Purpose:
 * This class contains the business logic related to documents.
 *
 * Responsibility:
 * - Save document information and upload files
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
    private final ModelMapper modelMapper;
    private final com.documentcentralizer.service.AuthBridgeService authBridgeService;
    private final com.documentcentralizer.service.S3Service s3Service;

    // Constructor Injection
    public DocumentServiceImpl(DocumentRepository documentRepository, UserRepository userRepository, ModelMapper modelMapper, com.documentcentralizer.service.AuthBridgeService authBridgeService, com.documentcentralizer.service.S3Service s3Service) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.authBridgeService = authBridgeService;
        this.s3Service = s3Service;
    }

    private DocumentResponseDTO convertToDTO(Document document) {
        DocumentResponseDTO dto = modelMapper.map(document, DocumentResponseDTO.class);
        if (document.getUser() != null) {
            dto.setUserId(document.getUser().getId());
        }
        return dto;
    }

    /*
     * Method: saveDocument()
     *
     * Purpose:
     * Uploads a document received from the client.
     *
     * Input:
     * MultipartFile uploaded by the user, metadata DTO, and User ID.
     *
     * Output:
     * Saved document metadata.
     *
     * Processing:
     * 1. Validate uploaded file.
     * 2. Check if user exists.
     * 3. Generate unique filename.
     * 4. Save file locally (can be swapped for cloud storage later).
     * 5. Store metadata in database.
     * 6. Return success response.
     */
    @Override
    public DocumentResponseDTO saveDocument(MultipartFile file, DocumentUploadRequestDTO requestDTO, Long userId) {
        // 1. Upload file to S3
        String objectKey = s3Service.uploadFile(file);

        // 2. Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        String originalFileName = file.getOriginalFilename();
        String storedFileName = objectKey.substring(objectKey.lastIndexOf("/") + 1);

        // 3. Store metadata in database
        // Map DTO to Entity
        Document document = modelMapper.map(requestDTO, Document.class);

        // Assign user and metadata to document
        document.setUser(user);
        document.setOriginalFileName(originalFileName);
        document.setStoredFileName(storedFileName);
        document.setObjectKey(objectKey);
        document.setFileSize(file.getSize());
        document.setContentType(file.getContentType());
        
        // Set default values for new document
        document.setVerificationStatus("PENDING");
        document.setIsDeleted(false);

        // Save metadata into database
        Document savedDocument = documentRepository.save(document);
        
        // 6. Return successful response
        return convertToDTO(savedDocument);
    }



    @Override
    public List<DocumentResponseDTO> getAllDocuments() {
        return documentRepository.findByIsDeletedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Document getDocumentEntityById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));

        if (document.getIsDeleted()) {
            throw new RuntimeException("Document is deleted");
        }

        return document;
    }

    @Override
    public DocumentResponseDTO getDocumentById(Long id) {
        Document document = getDocumentEntityById(id);
        return convertToDTO(document);
    }

    @Override
    public DocumentResponseDTO updateDocument(Long id, DocumentUpdateRequestDTO requestDTO) {
        // Find existing document
        Document existingDocument = getDocumentEntityById(id);

        // Use ModelMapper to update fields (it skips nulls as per our config)
        modelMapper.map(requestDTO, existingDocument);

        // Save updated document in database
        Document updatedDocument = documentRepository.save(existingDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public void deleteDocument(Long id) {
        // Find existing document
        Document document = getDocumentEntityById(id);

        // Delete object from S3
        s3Service.deleteFile(document.getObjectKey());

        // Delete database entry (hard delete as requested for S3 cleanup)
        documentRepository.delete(document);
    }

    @Override
    public List<DocumentResponseDTO> getDocumentsByStatus(String status) {
        return documentRepository.findByVerificationStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentResponseDTO> getDocumentsByUser(Long userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        return documentRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentResponseDTO changeVerificationStatus(Long id, String status, String reasonOrRemarks) {
        // Find existing document
        Document document = getDocumentEntityById(id);

        // Update verification status
        document.setVerificationStatus(status);

        // Set rejection reason if status is REJECTED
        if ("REJECTED".equalsIgnoreCase(status)) {
            document.setRejectionReason(reasonOrRemarks);
        } else {
            document.setRejectionReason(null);
        }
        
        // Set remarks if status is FORWARDED_TO_SUPERADMIN
        if ("FORWARDED_TO_SUPERADMIN".equalsIgnoreCase(status)) {
            document.setRemarks(reasonOrRemarks);
        }

        // Save updated document in database
        Document updatedDocument = documentRepository.save(document);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentResponseDTO verifyGovernmentDocument(Long id) {
        Document document = getDocumentEntityById(id);
        
        // Call Mock AuthBridge API
        boolean isSuccess = authBridgeService.verifyWithAuthBridge(document.getOcrText(), document.getDocumentType());
        
        if (isSuccess) {
            document.setVerificationStatus("VERIFIED");
            document.setRejectionReason(null);
            document.setRemarks("Auto-verified successfully via AuthBridge.");
        } else {
            document.setVerificationStatus("REJECTED");
            document.setRejectionReason("AuthBridge verification failed. Invalid document or poor OCR quality.");
            document.setRemarks("Auto-rejected via AuthBridge.");
        }
        
        Document updatedDocument = documentRepository.save(document);
        return convertToDTO(updatedDocument);
    }

    @Override
    public List<MyDocumentResponse> getMyDocuments(Long userId) {
        // Fetch documents belonging to the user, sorted by newest first
        List<Document> documents = documentRepository.findByUserIdOrderByUploadedAtDesc(userId);

        // Convert entities into DTOs
        return documents.stream()
                .map(doc -> MyDocumentResponse.builder()
                        .id(doc.getId())
                        .documentName(doc.getDocumentName())
                        .documentType(doc.getDocumentType())
                        .fileName(doc.getOriginalFileName())
                        .status(doc.getVerificationStatus())
                        .uploadedAt(doc.getUploadedAt())
                        .build())
                .toList();
    }
    @Override
    public com.documentcentralizer.dto.DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDocuments = documentRepository.count();
        long pendingDocuments = documentRepository.countByVerificationStatus("PENDING");
        long verifiedDocuments = documentRepository.countByVerificationStatus("VERIFIED");

        return com.documentcentralizer.dto.DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalDocuments(totalDocuments)
                .pendingDocuments(pendingDocuments)
                .verifiedDocuments(verifiedDocuments)
                .build();
    }

    @Override
    public org.springframework.core.io.Resource downloadDocumentAsResource(Long id) {
        // Find the document record in the database
        Document document = getDocumentEntityById(id);
        
        if (document.getObjectKey() == null) {
            throw new RuntimeException("This document was uploaded before S3 integration and is no longer available.");
        }
        
        // Fetch document directly from S3
        return s3Service.downloadFile(document.getObjectKey());
    }
}
