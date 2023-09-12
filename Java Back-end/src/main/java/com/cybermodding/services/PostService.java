package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.Reaction;
import com.cybermodding.entities.SubSection;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.CommentInDTO;
import com.cybermodding.payload.CommentOutDTO;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.PostOutDTO;
import com.cybermodding.payload.ReactionDTO;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.PostRepo;
import com.cybermodding.repositories.ReactionRepo;
import com.cybermodding.repositories.SubSectionRepo;
import com.cybermodding.repositories.UserRepo;

@Service
public class PostService {
    @Autowired
    PostRepo repo;
    @Autowired
    SubSectionRepo ss_repo;
    @Autowired
    UserService u_svc;
    @Autowired
    UserRepo u_repo;
    @Autowired
    ReactionRepo react_repo;
    @Autowired
    CommentRepo comm_repo;

    public Post getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Post not found **");
        }
    }

    public List<Post> getAllBySSId(Long ss_id) {
        return repo.findAllBySubSId(ss_id);
    }

    public CustomResponse updatePost(Long id, Post p) {
        if (repo.existsById(id)) {
            if (id.equals(p.getId())) {
                repo.save(p);
                return new CustomResponse(new Date(), "** Post updated succesfully **", HttpStatus.OK);
            } else {
                return new CustomResponse(new Date(), "** Input ID and Post ID does not match **",
                        HttpStatus.BAD_REQUEST);
            }
        } else {
            return new CustomResponse(new Date(), "** Post not found **",
                    HttpStatus.NOT_FOUND);
        }
    }

    public CustomResponse deletePost(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Post deleted succesfully **", HttpStatus.OK);
        } else {
            return new CustomResponse(new Date(), "** Post not found **", HttpStatus.NOT_FOUND);
        }
    }

    public Post createNewPost(PostDTO pd) {
        SubSection ss = ss_repo.existsById(pd.getSubSection_id()) ? ss_repo.findById(pd.getSubSection_id()).get()
                : null;
        User u = u_repo.existsById(pd.getUser_id()) ? u_repo.findById(pd.getUser_id()).get() : null;

        if (ss != null && u != null) {
            EPostType ept = pd.getType() == null ? EPostType.GENERAL : pd.getType();
            Post post = Post.builder().title(pd.getTitle()).body(pd.getBody()).type(ept).author(u)
                    .sub_section(ss).publishedDate(LocalDateTime.now()).build();
            return repo.save(post);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** User or SubSection not found **");
        }
    }

    public Reaction updateReaction(Long id, Reaction react) {
        if (react_repo.existsById(id)) {
            if (id.equals(react.getId())) {
                react_repo.save(react);
                return react;
            } else {
                throw new CustomException(HttpStatus.BAD_REQUEST, "** ID and Reaction ID does not match **");
            }
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Reaction not found **");
        }
    }

    public Reaction addReaction(ReactionDTO r) {
        Post post = repo.existsById(r.getPost_id()) ? repo.findById(r.getPost_id()).get() : null;
        User u = u_repo.existsById(r.getUser_id()) ? u_repo.findById(r.getUser_id()).get() : null;

        if (post != null && u != null) {
            if (post.getReactions().stream().anyMatch(re -> re.getUser().getId().equals(u.getId()))) {
                react_repo.deleteById(post.getReactions().stream().filter(re -> re.getUser().getId() == u.getId())
                        .findFirst().get().getId());
            }
            Reaction reaction = Reaction.builder().user(u).post(post).type(r.getType()).build();
            react_repo.save(reaction);
            return reaction;
        } else {
            return null;
        }
    }

    public CustomResponse removeReaction(Long id) {
        if (react_repo.existsById(id)) {
            react_repo.deleteById(id);
            return new CustomResponse(new Date(), "** Reaction deleted succesfully **", HttpStatus.OK);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Reaction not found **");
        }
    }

    public CommentOutDTO addComment(CommentInDTO comment) {
        Post post = getById(comment.getPost_id());
        User user = u_svc.getById(comment.getUser_id());

        if (post != null && user != null) {
            Comment comm = comm_repo.save(Comment.builder().content(comment.getContent()).user(user).post(post)
                    .publishedDate(LocalDateTime.now()).build());
            return CommentOutDTO.builder().content(comm.getContent()).id(comm.getId())
                    .publishedDate(comm.getPublishedDate()).user(comm.getUser())
                    .user_level(u_svc.getRank(comm.getUser().getId())).build();
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Post or User not found **");
        }
    }

    // delete comment

    public Post getRandom() {
        return repo.getRandom();
    }

    public PostOutDTO getPostOut(Long id) {
        Post p = getById(id);
        EUserLevel level = u_svc.getRank(p.getAuthor().getId());

        List<CommentOutDTO> lsOut = new ArrayList<>();
        p.getComments().forEach(c -> {
            lsOut.add(CommentOutDTO.builder().id(c.getId()).content(c.getContent()).user(c.getUser())
                    .publishedDate(c.getPublishedDate()).user_level(u_svc.getRank(c.getUser().getId())).build());
        });
        lsOut.sort(new Comparator<CommentOutDTO>() {
            @Override
            public int compare(CommentOutDTO c1, CommentOutDTO c2) {
                return c1.getPublishedDate().compareTo(c2.getPublishedDate());
            }
        });

        return new PostOutDTO(p.getId(), p.getTitle(), p.getBody(), p.getPublishedDate(), p.getType(), p.getAuthor(),
                p.getReactions(), lsOut, level, p.getSub_section().getParent_section().getTitle(),
                p.getSub_section().getParent_section().getId(), p.getSub_section().getTitle(),
                p.getSub_section().getId());
    }
}
