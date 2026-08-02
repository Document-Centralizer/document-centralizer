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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

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

    // Configurable local directory to store uploaded files
    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    // Constructor Injection
    public DocumentServiceImpl(DocumentRepository documentRepository, UserRepository userRepository, ModelMapper modelMapper) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    /*
     * Method: init()
     * Purpose: Initialize the upload directory during bean creation.
     */
    @PostConstruct
    public void init() {
        // Create upload directory if it does not exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
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
        // 1. Validate uploaded file
        validateFile(file);

        // 2. Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 3. Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName;

        // 4. Save file locally (Storage logic separated)
        String filePath = saveFileLocally(file, storedFileName);

        // 5. Store metadata in database
        // Map DTO to Entity
        Document document = modelMapper.map(requestDTO, Document.class);

        // Assign user and metadata to document
        document.setUser(user);
        document.setOriginalFileName(originalFileName);
        document.setStoredFileName(storedFileName);
        document.setFilePath(filePath);
        document.setFileSize(file.getSize());
        document.setFileFormat(file.getContentType());
        
        // Set default values for new document
        document.setVerificationStatus("PENDING");
        document.setIsDeleted(false);

        // Save metadata into database
        Document savedDocument = documentRepository.save(document);
        
        // 6. Return successful response
        return convertToDTO(savedDocument);
    }

    /*
     * Method: validateFile()
     * Purpose: Validates the uploaded file for empty status, blank name, type and size.
     */
    private void validateFile(MultipartFile file) {
        // Check if file is empty
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Check if file name is blank
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be blank");
        }

        // Validate maximum file size (Maximum 10 MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10 MB");
        }

        // Check supported file type
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("application/pdf") || 
            contentType.equals("image/jpeg") || contentType.equals("image/jpg") || 
            contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Unsupported file format. Allowed formats are: PDF, JPG, JPEG, PNG");
        }
    }

    /*
     * Method: saveFileLocally()
     * Purpose: Saves the file to local storage. Designed to be easily replaced by cloud storage later.
     */
    private String saveFileLocally(MultipartFile file, String storedFileName) {
        try {
            Path path = Paths.get(uploadDir, storedFileName);
            // Save file to local storage
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return path.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
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

        // Soft delete the record
        document.setIsDeleted(true);

        // Save the updated record
        documentRepository.save(document);
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
        try {
            // Find the document record in the database
            Document document = getDocumentEntityById(id);

            // Get the physical file path where it was stored
            Path filePath = Paths.get(document.getFilePath());

            // Convert physical file into a Spring Resource object
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

            // Check if the file actually exists and is readable
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or cannot be read!");
            }
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("Error while reading file: " + e.getMessage());
        }
    }
}
