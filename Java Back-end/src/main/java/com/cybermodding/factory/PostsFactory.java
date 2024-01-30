package com.cybermodding.factory;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.PostHome;
import com.cybermodding.responses.CommentCompleteOut;
import com.cybermodding.responses.CommentOut;
import com.cybermodding.responses.PostOutCPaged;
import com.cybermodding.responses.PostResponse;
import com.cybermodding.responses.PostWithID;
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
        if (!errorMessage.isEmpty()) {
            return new PostResponse(resBase, p.getId(), p.getTitle(), p.getBody(), p.getPublishedDate(), p.getType(),
                    p.getAuthor(), p.getReactions(), p.getComments());
        }
        return new PostResponse(resBase, null, null, null, null, null, null, null, null);
    }

    public static PostOutCPaged getPostOutCPaged(String errorMessage, Post p, Page<Comment> comments_page) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false, errorMessage,
                LocalDateTime.now());

        if (!errorMessage.isEmpty()) {
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

        if (!errorMessage.isEmpty()) {
            return new PostWithID(resBase, null, null, null, null, null, null, null, null, null, null);
        }
        return new PostWithID(resBase, p.getId(), p.getTitle(), p.getBody(), p.getType(), p.getAuthor().getId(),
                p.getSub_section().getId(), p.getComments().size(), p.getReactions().size(),
                p.getAuthor().getUsername(), null);
    }

    public static CommentCompleteOut getCommentCompleteOut(Comment c) {
        return new CommentCompleteOut(c.getId(), c.getContent(), getPostWithID("", c.getPost()),
                c.getUser().getUsername(), UserFactory.getRank(c.getUser()), c.getPublishedDate(), c.getUser().getId());
    }
}
