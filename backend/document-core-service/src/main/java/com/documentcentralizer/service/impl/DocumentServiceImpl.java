
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
import com.documentcentralizer.client.OcrClient;
import com.documentcentralizer.client.OcrRequest;
import com.documentcentralizer.client.OcrResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for document operations like upload, fetch, update,
 * and delete.
 */
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final com.documentcentralizer.service.AuthBridgeService authBridgeService;
    private final com.documentcentralizer.service.S3Service s3Service;
    private final OcrClient ocrClient;

    private DocumentResponseDTO convertToDTO(Document document) {
        DocumentResponseDTO dto = modelMapper.map(document, DocumentResponseDTO.class);
        if (document.getUser() != null) {
            dto.setUserId(document.getUser().getId());
        }
        return dto;
    }

    /**
     * Uploads a document to S3, processes OCR, and saves metadata.
     * 
     * @return Saved document metadata (DocumentResponseDTO).
     */
    @Override
    public DocumentResponseDTO saveDocument(MultipartFile file, DocumentUploadRequestDTO requestDTO, Long userId) {
        // 1. Check if user exists (Moved up to prevent S3 upload if invalid or limited)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 2. Check Subscription Limits
        if (!Boolean.TRUE.equals(user.getIsPremium())) {
            long totalCount = documentRepository.countByUserId(userId);
            if (totalCount >= 10) {
                throw new RuntimeException(
                        "Free plan limit exceeded. Please upgrade to a Premium subscription to store more documents.");
            }
        }

        // 3. Upload file to S3
        String objectKey = s3Service.uploadFile(file);

        String originalFileName = file.getOriginalFilename();
        String storedFileName = objectKey.substring(objectKey.lastIndexOf("/") + 1);

        // 4. Store metadata in database
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
        document.setVerificationStatus("PENDING_ADMIN");
        document.setIsDeleted(false);

        // Save metadata into database
        Document savedDocument = documentRepository.save(document);

        // 5a. Call OCR Service synchronously and save text
        try {
            OcrRequest ocrRequest = new OcrRequest();
            ocrRequest.setDocumentId(savedDocument.getId().toString());
            ocrRequest.setFileUrl(objectKey);

            OcrResponse ocrResponse = ocrClient.processDocument(ocrRequest);
            if (ocrResponse != null && ocrResponse.getExtractedText() != null) {
                savedDocument.setOcrText(ocrResponse.getExtractedText());
                savedDocument = documentRepository.save(savedDocument);
            }
        } catch (Exception e) {
            System.err.println("Failed to process OCR during document upload: " + e.getMessage());
        }

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

        // Generate a share slug if it is verified and doesn't have one
        if ("VERIFIED".equalsIgnoreCase(status)) {
            if (document.getShareSlug() == null) {
                document.setShareSlug(java.util.UUID.randomUUID().toString().substring(0, 8));
            }
            // Clear any old rejection or forwarding remarks when approved
            document.setRemarks(null);
            document.setRejectionReason(null);
        }

        // Set rejection reason if status is REJECTED
        if ("REJECTED".equalsIgnoreCase(status)) {
            document.setRejectionReason(reasonOrRemarks);
            document.setRemarks("Manually rejected by Admin/SuperAdmin");
        } else if (!"VERIFIED".equalsIgnoreCase(status)) {
            // Only clear rejection reason if not VERIFIED (since VERIFIED clears it above)
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
            if (document.getShareSlug() == null) {
                document.setShareSlug(java.util.UUID.randomUUID().toString().substring(0, 8));
            }
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
    public com.documentcentralizer.dto.UserDashboardStatsDTO getUserDashboardStats(Long userId) {
        long totalDocs = documentRepository.countByUserId(userId);
        long approvedDocs = documentRepository.countByUserIdAndVerificationStatus(userId, "VERIFIED");
        long rejectedDocs = documentRepository.countByUserIdAndVerificationStatus(userId, "REJECTED");
        long pendingAdmin = documentRepository.countByUserIdAndVerificationStatus(userId, "PENDING_ADMIN");
        long forwardedDocs = documentRepository.countByUserIdAndVerificationStatus(userId, "FORWARDED_TO_SUPERADMIN");

        return com.documentcentralizer.dto.UserDashboardStatsDTO.builder()
                .totalDocuments(totalDocs)
                .approvedDocuments(approvedDocs)
                .rejectedDocuments(rejectedDocs)
                .pendingDocuments(pendingAdmin + forwardedDocs)
                .build();
    }

    @Override
    public com.documentcentralizer.dto.AdminDashboardStatsDTO getAdminDashboardStats() {
        long pendingDocs = documentRepository.countByVerificationStatus("PENDING_ADMIN");
        long totalDocs = documentRepository.count();
        long verifiedDocs = documentRepository.countByVerificationStatus("VERIFIED");

        return com.documentcentralizer.dto.AdminDashboardStatsDTO.builder()
                .pendingAdminDocuments(pendingDocs)
                .totalDocuments(totalDocs)
                .verifiedDocuments(verifiedDocs)
                .build();
    }

    @Override
    public com.documentcentralizer.dto.SuperAdminDashboardStatsDTO getSuperAdminDashboardStats() {
        long forwardedDocs = documentRepository.countByVerificationStatus("FORWARDED_TO_SUPERADMIN");
        long totalDocs = documentRepository.count();
        long totalUsers = userRepository.count();
        long verifiedDocs = documentRepository.countByVerificationStatus("VERIFIED");
        long rejectedDocs = documentRepository.countByVerificationStatus("REJECTED");

        return com.documentcentralizer.dto.SuperAdminDashboardStatsDTO.builder()
                .forwardedDocuments(forwardedDocs)
                .totalSystemDocuments(totalDocs)
                .totalSystemUsers(totalUsers)
                .totalVerifiedDocuments(verifiedDocs)
                .totalRejectedDocuments(rejectedDocs)
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

    @Override
    public DocumentResponseDTO getDocumentMetadataByShareSlug(String shareSlug) {
        Document document = documentRepository.findByShareSlug(shareSlug)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return convertToDTO(document);
    }

    @Override
    public org.springframework.core.io.Resource getDocumentByShareSlug(String shareSlug) {
        Document document = documentRepository.findByShareSlug(shareSlug)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!"VERIFIED".equals(document.getVerificationStatus())) {
            throw new RuntimeException("Document not verified for sharing");
        }
        return s3Service.downloadFile(document.getObjectKey());
    }
}
