package com.cybermodding.responses;

import java.time.LocalDateTime;
import java.util.List;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Reaction;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class PostResponse {
    private ResponseBase response;
    private Long id;
    private String title;
    private String body;
    private LocalDateTime publishedDate;
    private EPostType type;
    private User author;
    private List<Reaction> reactions;
    private List<Comment> comments;
}
