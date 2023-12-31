package com.cybermodding.payload;

import com.cybermodding.enumerators.EPostType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PostDTO {
    private String title;
    private String body;
    private EPostType type;
    private Long user_id;
    private Long subSection_id;
}
