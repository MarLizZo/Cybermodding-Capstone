package com.cybermodding.responses;

import com.cybermodding.enumerators.EPostType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostWithID {
    private ResponseBase response;
    private Long id;
    private String title;
    private String body;
    private EPostType type;
    private Long user_id;
    private Long subSection_id;
    private Integer comments_count;
}
