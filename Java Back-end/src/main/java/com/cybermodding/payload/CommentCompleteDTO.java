package com.cybermodding.payload;

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
    private PostDTOWithID post;
}
