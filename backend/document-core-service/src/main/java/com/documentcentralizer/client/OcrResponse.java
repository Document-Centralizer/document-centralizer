package com.documentcentralizer.client;

/**
 * Represents the response payload from the OCR service.
 * Holds the extracted text and confidence scores.
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
