package com.cybermodding.responses;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchRes {
    private Page<ProfileOut> users;
    private Page<PostWithID> posts;
    private Page<CommentCompleteOut> comments;
}
