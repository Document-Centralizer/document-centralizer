package com.documentcentralizer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequestDTO {
    private Long adminUserId;
    private String status;
    private String remarks;
    private String rejectionReason;
}
