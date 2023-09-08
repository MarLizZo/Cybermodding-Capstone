package com.cybermodding.payload;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CommentInDTO {
    private String content;
    private Long user_id;
    private Long post_id;
    private LocalDate publishedDate;
}
