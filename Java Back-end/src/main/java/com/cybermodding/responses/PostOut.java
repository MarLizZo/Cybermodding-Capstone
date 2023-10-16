package com.cybermodding.responses;

import java.time.LocalDateTime;
import java.util.List;
import com.cybermodding.entities.Reaction;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.enumerators.EUserLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class PostOut {
    @Builder.Default
    private ResponseBase response = null;
    private Long id;
    private String title;
    private String body;
    private LocalDateTime publishedDate;
    private EPostType type;
    private User author;
    private List<Reaction> reactions;
    private EUserLevel user_level;
    private String main_section_title;
    private Long main_section_id;
    private String subsection_title;
    private Long subsection_id;
    private Integer comments_count;
    private CommentOut last_comment;
}
