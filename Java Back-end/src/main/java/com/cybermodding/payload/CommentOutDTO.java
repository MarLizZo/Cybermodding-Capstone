package com.cybermodding.payload;

import java.time.LocalDateTime;

import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CommentOutDTO {
    private Long id;
    private String content;
    private User user;
    private LocalDateTime publishedDate;
    private EUserLevel user_level;
}