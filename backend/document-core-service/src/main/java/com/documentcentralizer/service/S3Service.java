package com.documentcentralizer.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
    String uploadFile(MultipartFile file);
    Resource downloadFile(String objectKey);
    void deleteFile(String objectKey);
}
