package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDTO {
    private long pendingAdminDocuments;
    private long totalDocuments;
    private long verifiedDocuments;
    private java.util.List<RecentActivityDTO> recentActivities;
    private java.util.List<StorageBreakdownDTO> storageBreakdown;
}
