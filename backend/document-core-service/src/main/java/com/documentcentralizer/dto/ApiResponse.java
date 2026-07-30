package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * Class Name : ApiResponse
 *
 * Purpose:
 * Generic wrapper for API responses.
 *
 * Responsibility:
 * - Format the API output properly
 *
 * Author:
 * CDAC Project
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
