package com.cybermodding.responses;

import java.time.LocalDateTime;

import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class CommentOut {
    private Long id;
    private String content;
    private User user;
    private LocalDateTime publishedDate;
    private EUserLevel user_level;
}
