package com.documentcentralizer.client;

/**
 * Defines the interface for HTTP communication with the Python OCR Service.
 * Sends document paths or images to OCR service and receives extracted text.
 */
public interface OcrClient {
    
    /**
     * Calls the external Python OCR API to extract text from a document.
     * @param request The request containing the document URL or ID.
     * @return OcrResponse containing the extracted text.
     */
    OcrResponse processDocument(OcrRequest request);
}
