package com.documentcentralizer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

/**
 * Mock AuthBridge API for verifying Government Documents (e.g. Aadhar, PAN).
 */
@RestController
@RequestMapping("/api/mock/authbridge")
public class MockAuthBridgeController {

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDocument(@RequestBody Map<String, String> payload) {
        String ocrText = payload.get("ocrText");
        
        Map<String, Object> response = new HashMap<>();
        
        // Simple mock logic: if OCR text contains "FAKE" or is too short, reject
        if (ocrText == null || ocrText.trim().isEmpty() || ocrText.toUpperCase().contains("FAKE")) {
            response.put("status", "FAILURE");
            response.put("confidence", 30);
            response.put("message", "Document verification failed. Invalid or low quality text.");
        } else {
            response.put("status", "SUCCESS");
            response.put("confidence", 92);
            response.put("message", "Document verified successfully against government records.");
        }
        
        return ResponseEntity.ok(response);
    }
}
