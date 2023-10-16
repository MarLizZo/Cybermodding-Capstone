package com.cybermodding.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class SectionResponse {
    private ResponseBase response;
    private Long id;
    private String title;
    private String description;
    private Boolean active;
    private Integer order_number;
}
