package com.cybermodding.responses;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;

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
@Builder
@Data
public class PostOutCPaged {
    private ResponseBase response;
    private Long id;
    private String title;
    private String body;
    private LocalDateTime publishedDate;
    private EPostType type;
    private User author;
    private List<Reaction> reactions;
    private Page<CommentOut> comments;
    private EUserLevel user_level;
    private String main_section_title;
    private Long main_section_id;
    private String subsection_title;
    private Long subsection_id;
}
