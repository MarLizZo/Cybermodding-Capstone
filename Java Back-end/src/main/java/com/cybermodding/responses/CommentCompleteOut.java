package com.cybermodding.responses;

import java.time.LocalDateTime;

import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CommentCompleteOut {
    private Long id;
    private String content;
    private PostWithID post;
    private String user_name;
    private EUserLevel user_level;
    private LocalDateTime publishedDate;
    private Long user_id;
}
