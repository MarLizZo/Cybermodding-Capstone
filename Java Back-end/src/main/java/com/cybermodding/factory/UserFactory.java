package com.cybermodding.factory;

import java.time.LocalDateTime;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ERole;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.responses.CommentCompleteOut;
import com.cybermodding.responses.PostWithID;
import com.cybermodding.responses.ProfileOut;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.UserResponse;

public class UserFactory {
    public static UserResponse getUserResponse(String errorMessage, User user) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false,
                errorMessage.isEmpty() ? "" : errorMessage, LocalDateTime.now());
        if (!errorMessage.isEmpty()) {
            return new UserResponse(resBase, null, null, null, null, null, null, null);
        }
        return new UserResponse(resBase, user.getId(), user.getUsername(), user.getEmail(), user.getRegistrationDate(),
                user.getDescription(), user.getAvatar(), user.getBirthdate());
    }

    public static EUserLevel getRank(User u) {
        return u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_ADMIN)) ? EUserLevel.BOSS
                : u.getRoles().stream().anyMatch(r -> r.getRoleName().equals(ERole.ROLE_MODERATOR))
                        ? EUserLevel.MID
                        : u.getRoles().stream().anyMatch(
                                r -> r.getRoleName().equals(ERole.ROLE_BANNED))
                                        ? EUserLevel.BANNED
                                        : EUserLevel.BASE;
    }

    public static ProfileOut getProfileOut(String errorMessage, User u) {
        ResponseBase resBase = new ResponseBase(errorMessage.isEmpty() ? true : false,
                errorMessage.isEmpty() ? "" : errorMessage, LocalDateTime.now());

        if (!errorMessage.isEmpty()) {
            return new ProfileOut(resBase, null, null, null, null, null, null, null, null, null, null, null, null);
        }

        Post p = u.getPosts().size() != 0 ? PostsFactory.getLastPost(u.getPosts()) : null;
        PostWithID pid = p == null ? null : PostsFactory.getPostWithID("", p);

        Comment c = u.getComments().size() != 0 ? PostsFactory.getLastComment(u.getComments()) : null;
        CommentCompleteOut cout = c == null ? null : PostsFactory.getCommentCompleteOut(c);

        return new ProfileOut(resBase, u.getId(), u.getUsername(), u.getEmail(), u.getRegistrationDate(),
                u.getDescription(), u.getAvatar(), u.getBirthdate(), u.getPosts().size(), u.getComments().size(), pid,
                cout, getRank(u));
    }
}
