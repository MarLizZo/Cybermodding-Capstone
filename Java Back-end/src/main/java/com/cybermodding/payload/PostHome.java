package com.cybermodding.payload;

import java.time.LocalDateTime;
import java.util.List;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Reaction;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PostHome {
    private Long id;
    private String title;
    private String body;
    private LocalDateTime publishedDate;
    private EPostType type;
    private User author;
    private List<Reaction> reactions;
    private List<Comment> comments;
    private EUserLevel user_level;
}
