package com.cybermodding.responses;

import java.time.LocalDateTime;

import com.cybermodding.entities.Post;
import com.cybermodding.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class CommentResponse {
    private ResponseBase response;
    private Long id;
    private String content;
    private User user;
    private Post post;
    private LocalDateTime publishedDate;
}
