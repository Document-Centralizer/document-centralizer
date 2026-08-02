package com.documentcentralizer.client;

/**
 * Represents the request payload for the OCR service.
 * Holds the image/PDF data needed to extract text.
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
