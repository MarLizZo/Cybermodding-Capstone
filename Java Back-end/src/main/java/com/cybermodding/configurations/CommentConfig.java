package com.cybermodding.configurations;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.User;

@Configuration
public class CommentConfig {

    @Bean
    @Scope("prototype")
    Comment commentCreator(String _content, User _user, Post _post, LocalDateTime _publishedDate) {
        return Comment.builder().content(_content).user(_user).post(_post).publishedDate(_publishedDate).build();
    }
}
