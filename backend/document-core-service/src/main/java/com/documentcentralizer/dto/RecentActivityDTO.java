package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityDTO {
    private String action;
    private String desc;
    private String time;
    private String icon;
    private String bg;
    private String color;
}
