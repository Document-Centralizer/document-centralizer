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

    @PostMapping("/verify/aadhaar")
    public ResponseEntity<Map<String, Object>> verifyAadhaar(@RequestBody Map<String, String> payload) {
        return processMockVerification(payload, "Aadhaar", 12);
    }

    @PostMapping("/verify/pan")
    public ResponseEntity<Map<String, Object>> verifyPan(@RequestBody Map<String, String> payload) {
        return processMockVerification(payload, "PAN Card", 10);
    }

    @PostMapping("/verify/driving-license")
    public ResponseEntity<Map<String, Object>> verifyDrivingLicense(@RequestBody Map<String, String> payload) {
        return processMockVerification(payload, "Driving License", 15);
    }

    @PostMapping("/verify/passport")
    public ResponseEntity<Map<String, Object>> verifyPassport(@RequestBody Map<String, String> payload) {
        return processMockVerification(payload, "Passport", 8);
    }

    private ResponseEntity<Map<String, Object>> processMockVerification(Map<String, String> payload, String docType, int minLength) {
        String ocrText = payload.get("ocrText");
        Map<String, Object> response = new HashMap<>();

        if (ocrText == null || ocrText.trim().length() < minLength || ocrText.toUpperCase().contains("FAKE")) {
            response.put("status", "FAILURE");
            response.put("confidence", 30);
            response.put("message", docType + " verification failed. Invalid, missing, or poor quality data.");
        } else {
            response.put("status", "SUCCESS");
            response.put("confidence", 95);
            response.put("message", docType + " verified successfully against government records.");
        }
        return ResponseEntity.ok(response);
    }
}
