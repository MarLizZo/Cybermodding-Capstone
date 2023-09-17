package com.cybermodding.payload;

import com.cybermodding.entities.Post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CommentCompleteDTO {
    private Long id;
    private String content;
    private Post post;
}
