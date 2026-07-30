package com.documentcentralizer.client;

/**
 * Purpose:
 * Defines the interface for HTTP communication with the Python OCR Service.
 * 
 * Responsibility:
 * Sends document paths or images to OCR service and receives extracted text.
 * Do NOT implement OCR logic here, only HTTP communication.
 * 
 * Usage:
 * Inject this interface into DocumentService or VerificationService.
 * 
 * Author:
 * CDAC Project
 */
public interface OcrClient {
    
    /**
     * Purpose:
     * Calls the external Python OCR API to extract text from a document.
     * 
     * Input:
     * OcrRequest containing the document URL or ID.
     * 
     * Output:
     * OcrResponse containing the extracted text.
     * 
     * Processing:
     * Performs a REST call to the OCR microservice.
     */
    OcrResponse processDocument(OcrRequest request);
}
