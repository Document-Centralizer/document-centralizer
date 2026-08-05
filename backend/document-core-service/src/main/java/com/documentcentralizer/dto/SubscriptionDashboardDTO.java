package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDashboardDTO {
    private long basicCount;
    private long premiumCount;
    private List<UserProfileDTO> subscribedUsers;
}
