package com.documentcentralizer.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class VerificationResponseDTO {
    private Long id;
    private Long documentId;
    private Long verifiedByUserId;
    private String status;
    private String remarks;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
