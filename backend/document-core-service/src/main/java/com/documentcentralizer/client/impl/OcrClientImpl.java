package com.documentcentralizer.client.impl;

import com.documentcentralizer.client.OcrClient;
import com.documentcentralizer.client.OcrResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class OcrClientImpl implements OcrClient {

    private final RestTemplate restTemplate;

    @Value("${ocr.service.url:http://localhost:5000/extract}")
    private String ocrServiceUrl;

    public OcrClientImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public OcrResponse processDocument(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.png";
                }
            };
            
            HttpHeaders filePartHeaders = new HttpHeaders();
            filePartHeaders.setContentType(MediaType.parseMediaType(file.getContentType() != null ? file.getContentType() : "image/png"));
            HttpEntity<ByteArrayResource> filePartEntity = new HttpEntity<>(fileAsResource, filePartHeaders);
            
            body.add("file", filePartEntity);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(ocrServiceUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> bodyMap = response.getBody();
                OcrResponse ocrResponse = new OcrResponse();
                if (bodyMap.containsKey("extracted_text")) {
                    ocrResponse.setExtractedText(bodyMap.get("extracted_text").toString());
                }
                
                // Read dynamic confidence score from python service
                if (bodyMap.containsKey("confidence_score")) {
                    try {
                        ocrResponse.setConfidenceScore(Double.parseDouble(bodyMap.get("confidence_score").toString()));
                    } catch (NumberFormatException e) {
                        ocrResponse.setConfidenceScore(100.0);
                    }
                } else {
                    ocrResponse.setConfidenceScore(100.0);
                }
                
                return ocrResponse;
            }
        } catch (Exception e) {
            System.err.println("Real OCR API call failed: " + e.getMessage());
        }
        return null;
    }
}
