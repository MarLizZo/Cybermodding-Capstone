package com.cybermodding.payload;

import com.cybermodding.entities.Section;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubSectionDto {
    private String title;
    private String description;
    private Boolean active;
    private Integer order_number;
    private Section parent_section;
}
