package com.documentcentralizer.client.impl;

import com.documentcentralizer.client.OcrClient;
import com.documentcentralizer.client.OcrRequest;
import com.documentcentralizer.client.OcrResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OcrClientImpl implements OcrClient {

    private final RestTemplate restTemplate;

    @Value("${ocr.service.url:http://localhost:5000/api/ocr}")
    private String ocrServiceUrl;

    public OcrClientImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public OcrResponse processDocument(OcrRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<OcrRequest> httpRequest = new HttpEntity<>(request, headers);
            
            ResponseEntity<OcrResponse> response = restTemplate.postForEntity(ocrServiceUrl, httpRequest, OcrResponse.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("OCR API call failed: " + e.getMessage());
        }
        return null;
    }
}
