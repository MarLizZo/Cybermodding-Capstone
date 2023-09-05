package com.cybermodding.services;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Post;
import com.cybermodding.entities.Reaction;
import com.cybermodding.entities.SubSection;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.EPostType;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.ReactionDTO;
import com.cybermodding.repositories.PostRepo;
import com.cybermodding.repositories.SubSectionRepo;
import com.cybermodding.repositories.UserRepo;

@Service
public class PostService {
    @Autowired
    PostRepo repo;
    @Autowired
    SubSectionRepo ss_repo;
    @Autowired
    UserRepo u_repo;

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
                    .sub_section(ss).publishedDate(LocalDate.now()).build();
            return repo.save(post);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** User or SubSection not found **");
        }
    }

    public CustomResponse addReaction(ReactionDTO r) {
        Post post = repo.existsById(r.getPost_id()) ? repo.findById(r.getPost_id()).get() : null;
        User u = u_repo.existsById(r.getUser_id()) ? u_repo.findById(r.getUser_id()).get() : null;

        if (post != null && u != null) {
            Reaction reaction = Reaction.builder().user(u).post(post).type(r.getType()).build();
            List<Reaction> reactionsLs = post.getReactions();
            reactionsLs.add(reaction);
            post.setReactions(reactionsLs);
            return new CustomResponse(new Date(), "** Reaction added to Post succesfully **", HttpStatus.OK);
        } else {
            return new CustomResponse(new Date(), "** Post or User not found **", HttpStatus.BAD_REQUEST);
        }
    }
}
