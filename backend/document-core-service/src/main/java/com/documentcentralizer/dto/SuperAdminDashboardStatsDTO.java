package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperAdminDashboardStatsDTO {
    private long forwardedDocuments;
    private long totalSystemDocuments;
    private long totalSystemUsers;
    private long totalVerifiedDocuments;
    private long totalRejectedDocuments;
}
