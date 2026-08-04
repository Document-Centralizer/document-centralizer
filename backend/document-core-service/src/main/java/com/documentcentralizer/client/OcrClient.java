package com.documentcentralizer.client;

import org.springframework.web.multipart.MultipartFile;

/**
 * Defines the interface for HTTP communication with the Python OCR Service.
 * Sends document paths or images to OCR service and receives extracted text.
 */
public interface OcrClient {
    
    /**
     * Calls the external Python OCR API to extract text from a document.
     * @param file The file to be processed.
     * @return OcrResponse containing the extracted text.
     */
    OcrResponse processDocument(MultipartFile file);
}
