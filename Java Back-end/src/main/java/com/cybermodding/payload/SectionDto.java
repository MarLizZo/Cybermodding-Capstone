package com.cybermodding.payload;

import com.cybermodding.enumerators.ESectionCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectionDto {
    private String title;
    private String description;
    private Boolean active;
    private ESectionCategory category;
    private Integer order_number;
}
