package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Purpose:
 * DTO to return document details for the "My Documents" API.
 * 
 * Responsibility:
 * Exposes only the necessary information about a user's document, 
 * keeping the entity object secure.
 * 
 * Usage:
 * Returned by the DocumentController in the /api/documents/my endpoint.
 * 
 * Author:
 * CDAC Project
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyDocumentResponse {
    
    private Long id;
    
    private String documentName;
    
    private String documentType;
    
    private String fileName;
    
    private String status;
    
    private LocalDateTime uploadedAt;
}
