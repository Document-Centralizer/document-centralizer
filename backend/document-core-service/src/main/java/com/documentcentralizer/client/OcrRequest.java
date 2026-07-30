package com.documentcentralizer.client;

/**
 * Purpose:
 * Represents the request payload for the OCR service.
 * 
 * Responsibility:
 * Holds the image or PDF file data required to extract text.
 * 
 * Usage:
 * Passed to OcrClient to trigger OCR processing.
 * 
 * Author:
 * CDAC Project
 */
public class OcrRequest {
    private String documentId;
    private String fileUrl;

    // Default Constructor
    public OcrRequest() {}

    // Getters and Setters
    public String getDocumentId() {
        return documentId;
    }
    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getFileUrl() {
        return fileUrl;
    }
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}
