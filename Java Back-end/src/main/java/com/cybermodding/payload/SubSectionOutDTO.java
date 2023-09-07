package com.cybermodding.payload;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class SubSectionOutDTO {
    private Long id;
    private String title;
    private String description;
    private Boolean active;
    private Integer order_number;
    private List<PostOutDTO> posts = new ArrayList<PostOutDTO>();
    private Long parent_id;
    private String parent_title;
}
