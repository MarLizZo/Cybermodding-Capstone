package com.cybermodding.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class SubSectionOut {
    private ResponseBase response;
    private Long id;
    private String title;
    private String description;
    private Boolean active;
    private Integer order_number;
    private List<PostOut> posts;
    private Long parent_id;
    private String parent_title;
}
