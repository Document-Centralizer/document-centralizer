package com.documentcentralizer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageBreakdownDTO {
    private String label;
    private String value;
    private String percentage;
    private String color;
}
