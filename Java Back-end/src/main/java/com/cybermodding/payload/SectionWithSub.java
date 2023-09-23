package com.cybermodding.payload;

import java.util.List;

import com.cybermodding.entities.SubSection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class SectionWithSub {
    private Long id;
    private String title;
    private String description;
    private Boolean active;
    private Integer order_number;
    private List<SubSection> sub_sections;
}
