package com.documentcentralizer.client;

/**
 * Purpose:
 * Represents the response payload from the OCR service.
 * 
 * Responsibility:
 * Holds the extracted text and confidence scores.
 * 
 * Usage:
 * Returned by OcrClient after successful processing.
 * 
 * Author:
 * CDAC Project
 */
public class OcrResponse {
    private String extractedText;
    private double confidenceScore;

    public OcrResponse() {}

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
}
