package com.cybermodding.payload;

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
public class ProfileOutDTO {
    private Long id;
    private String username;
    private String email;
    private LocalDate registrationDate;
    private String description;
    private String avatar;
    private LocalDate birthdate;
    private Integer posts_count;
    private Integer comments_count;
    private PostDTOWithID last_post;
    private CommentCompleteDTO last_comment;
    private EUserLevel level;
}
