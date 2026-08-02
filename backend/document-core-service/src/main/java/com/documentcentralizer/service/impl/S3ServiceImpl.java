package com.documentcentralizer.service.impl;

import com.documentcentralizer.service.S3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.UUID;

/*
 * Class Name : S3ServiceImpl
 *
 * Purpose:
 * This class handles direct interaction with AWS S3 for uploading, downloading, and deleting files.
 *
 * Responsibility:
 * - Validate the uploaded file size and extension.
 * - Generate a unique object key (filename) to prevent overriding in S3.
 * - Upload files to the configured S3 bucket.
 * - Download files from the configured S3 bucket.
 * - Delete files from the configured S3 bucket.
 *
 * Author:
 * CDAC Project
 */
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;


    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be blank");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10 MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("application/pdf") || 
            contentType.equals("image/jpeg") || contentType.equals("image/jpg") || 
            contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Unsupported file format. Allowed formats are: PDF, JPG, JPEG, PNG");
        }
    }

    private String getFolderPrefix(String contentType) {
        if (contentType.equals("application/pdf")) {
            return "documents/pdf/";
        } else {
            return "documents/images/";
        }
    }

    @Override
    public String uploadFile(MultipartFile file) {
        validateFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + extension;
            
            String folderPrefix = getFolderPrefix(file.getContentType());
            String objectKey = folderPrefix + uniqueFileName;


            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return objectKey;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file for upload: " + e.getMessage());
        } catch (S3Exception e) {
            throw new RuntimeException("AWS S3 Upload Error: " + e.getMessage());
        }
    }

    @Override
    public Resource downloadFile(String objectKey) {
        try {

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
            byte[] content = s3Object.readAllBytes();

            return new ByteArrayResource(content);
        } catch (NoSuchKeyException e) {
            throw new RuntimeException("File not found in S3 bucket.");
        } catch (IOException | S3Exception e) {
            throw new RuntimeException("AWS S3 Download Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String objectKey) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("AWS S3 Delete Error: " + e.getMessage());
        }
    }
}
