package com.documentcentralizer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.HashMap;

@Service
public class AuthBridgeService {

    private final RestTemplate restTemplate;

    public AuthBridgeService() {
        this.restTemplate = new RestTemplate();
    }

    public boolean verifyWithAuthBridge(String ocrText, String documentType) {
        try {
            // Determine endpoint based on documentType (e.g., AADHAAR, PAN, DRIVING_LICENSE, PASSPORT)
            String endpoint = "/verify/pan"; // default fallback
            if (documentType != null) {
                switch (documentType.toUpperCase()) {
                    case "AADHAAR":
                        endpoint = "/verify/aadhaar";
                        break;
                    case "PAN":
                    case "PAN_CARD":
                        endpoint = "/verify/pan";
                        break;
                    case "DRIVING_LICENSE":
                        endpoint = "/verify/driving-license";
                        break;
                    case "PASSPORT":
                        endpoint = "/verify/passport";
                        break;
                }
            }

            String url = "http://localhost:8080/api/mock/authbridge" + endpoint;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> payload = new HashMap<>();
            payload.put("ocrText", ocrText != null ? ocrText : "");
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String status = (String) response.getBody().get("status");
                return "SUCCESS".equals(status);
            }
            return false;
        } catch (Exception e) {
            System.err.println("AuthBridge API call failed: " + e.getMessage());
            return false;
        }
    }
}
