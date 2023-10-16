package com.cybermodding.responses;

import java.util.List;

import com.cybermodding.entities.Post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class SubSectionResponse {
    private ResponseBase response;
    private Long id;
    private String title;
    private String description;
    private Boolean active;
    private Integer order_number;
    private List<Post> posts;
}
