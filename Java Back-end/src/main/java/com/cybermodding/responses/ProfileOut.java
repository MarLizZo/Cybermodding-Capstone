package com.cybermodding.responses;

import java.time.LocalDate;

import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProfileOut {
    private ResponseBase response;
    private Long id;
    private String username;
    private String email;
    private LocalDate registrationDate;
    private String description;
    private String avatar;
    private LocalDate birthdate;
    private Integer posts_count;
    private Integer comments_count;
    private PostWithID last_post;
    private CommentCompleteOut last_comment;
    private EUserLevel level;
}
