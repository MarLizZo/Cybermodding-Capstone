package com.cybermodding.payload;

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
    private Long parent_section_id;
}
