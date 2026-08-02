package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDashboardStatsDTO {
    private long totalDocuments;
    private long approvedDocuments;
    private long rejectedDocuments;
    private long pendingDocuments;
}
