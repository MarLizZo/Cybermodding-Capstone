package com.cybermodding.factory;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.Reaction;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.PostHome;
import com.cybermodding.responses.CommentCompleteOut;
import com.cybermodding.responses.CommentOut;
import com.cybermodding.responses.CommentResponse;
import com.cybermodding.responses.PostOut;
import com.cybermodding.responses.PostOutCPaged;
import com.cybermodding.responses.PostResponse;
import com.cybermodding.responses.PostWithID;
import com.cybermodding.responses.ReactionResponse;
import com.cybermodding.responses.ResponseBase;

public class PostsFactory {
    public static Post getLastPost(List<Post> ls) {
        ls.sort(new Comparator<Post>() {
            @Override
            public int compare(Post p1, Post p2) {
                return p2.getPublishedDate().compareTo(p1.getPublishedDate());
            }
        });
        return ls.get(0);
    }

    public static PostResponse getPostResponse(String errorMessage, Post p) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (errorMessage.isEmpty()) {
            return new PostResponse(resBase, p.getId(), p.getTitle(), p.getBody(), p.getPublishedDate(), p.getType(),
                    p.getAuthor(), p.getReactions(), p.getComments());
        }
        return new PostResponse(resBase, null, null, null, null, null, null, null, null);
    }

    public static PostOutCPaged getPostOutCPaged(String errorMessage, Post p, Page<Comment> comments_page) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());

        if (errorMessage.isEmpty()) {
            EUserLevel level = UserFactory.getRank(p.getAuthor());

            Page<CommentOut> comments_page_out = comments_page
                    .map(c -> CommentOut.builder().id(c.getId()).content(c.getContent()).user(c.getUser())
                            .publishedDate(c.getPublishedDate()).user_level(UserFactory.getRank(c.getUser())).build());

            return new PostOutCPaged(resBase, p.getId(), p.getTitle(), p.getBody(),
                    p.getPublishedDate(), p.getType(),
                    p.getAuthor(),
                    p.getReactions(), comments_page_out, level, p.getSub_section().getParent_section().getTitle(),
                    p.getSub_section().getParent_section().getId(), p.getSub_section().getTitle(),
                    p.getSub_section().getId());
        }
        return new PostOutCPaged(resBase, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    public static Page<PostHome> getPagePostHome(Page<Post> pp) {
        return pp.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                UserFactory.getRank(post.getAuthor())));
    }

    public static ReactionResponse getReactionResponse(String errorMessage, Reaction r) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());
        if (errorMessage.isEmpty()) {
            return new ReactionResponse(resBase, r.getId(), r.getUser(), r.getType());
        }
        return new ReactionResponse(resBase, null, null, null);
    }

    public static Comment getLastComment(List<Comment> ls) {
        ls.sort(new Comparator<Comment>() {
            @Override
            public int compare(Comment p1, Comment p2) {
                return p2.getPublishedDate().compareTo(p1.getPublishedDate());
            }
        });
        return ls.get(0);
    }

    public static PostWithID getPostWithID(String errorMessage, Post p) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());

        if (errorMessage.isEmpty()) {
            return new PostWithID(resBase, p.getId(), p.getTitle(), p.getBody(), p.getType(), p.getAuthor().getId(),
                    p.getSub_section().getId(), p.getComments().size(), p.getReactions().size(),
                    p.getAuthor().getUsername(), null);
        }
        return new PostWithID(resBase, null, null, null, null, null, null, null, null, null, null);
    }

    public static PostOut getPostOut(Post post, CommentOut cmOut) {
        return PostOut.builder().id(post.getId()).title(post.getTitle())
                .body(post.getBody()).publishedDate(post.getPublishedDate()).type(post.getType())
                .author(post.getAuthor()).reactions(post.getReactions())
                .user_level(UserFactory.getRank(post.getAuthor()))
                .main_section_title(post.getSub_section().getParent_section().getTitle())
                .main_section_id(post.getSub_section().getParent_section().getId())
                .subsection_title(post.getSub_section().getTitle())
                .subsection_id(post.getSub_section().getId()).comments_count(post.getComments().size())
                .last_comment(cmOut != null ? cmOut : null).build();
    }

    public static CommentCompleteOut getCommentCompleteOut(Comment c) {
        return new CommentCompleteOut(c.getId(), c.getContent(), getPostWithID("", c.getPost()),
                c.getUser().getUsername(), UserFactory.getRank(c.getUser()), c.getPublishedDate(), c.getUser().getId());
    }

    public static CommentOut getCommentOut(Comment c) {
        return CommentOut.builder().id(c.getId()).content(c.getContent())
                .user(c.getUser()).publishedDate(c.getPublishedDate())
                .user_level(UserFactory.getRank(c.getUser())).build();
    }

    public static CommentResponse getCommentResponse(String errorMessage, Comment c) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());

        if (errorMessage.isEmpty()) {
            return new CommentResponse(resBase, c.getId(), c.getContent(),
                    c.getUser(), c.getPost(), c.getPublishedDate());
        }
        return new CommentResponse(resBase, null, null, null, null, null);
    }
}
