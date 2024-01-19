package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import com.cybermodding.payload.PostDTO;
import com.cybermodding.payload.PostHome;
import com.cybermodding.payload.ReactionDTO;
import com.cybermodding.payload.UpdatePostDTO;
import com.cybermodding.repositories.CommentRepo;
import com.cybermodding.repositories.CommentRepoPage;
import com.cybermodding.repositories.PostPageableRepo;
import com.cybermodding.repositories.PostRepo;
import com.cybermodding.repositories.ReactionRepo;
import com.cybermodding.repositories.SubSectionRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CommentOut;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.PostWithID;
import com.cybermodding.responses.ReactionResponse;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.PostOutCPaged;
import com.cybermodding.responses.PostResponse;

@Service
public class PostService {
    @Autowired
    PostRepo repo;
    @Autowired
    PostPageableRepo page_repo;
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
    @Autowired
    CommentRepoPage comm_page;

    public Post getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Post not found **");
        }
    }

    public PostWithID getByIdPout(Long id) {
        if (repo.existsById(id)) {
            Post p = repo.findById(id).get();
            return new PostWithID(new ResponseBase(true, "", LocalDateTime.now()), p.getId(), p.getTitle(), p.getBody(),
                    p.getType(), p.getAuthor().getId(),
                    p.getSub_section().getId(), p.getComments().size(), p.getReactions().size(), p.getAuthor().getUsername(), u_svc.getRank(p.getAuthor().getId()));
        } else {
            return new PostWithID(new ResponseBase(false, "** Post not found **", LocalDateTime.now()), null, null,
                    null, null, null, null, null, null, null, null);
        }
    }

    public List<Post> getAllBySSId(Long ss_id) {
        return repo.findAllBySubSId(ss_id);
    }

    public PostResponse updatePost(Long user_id, String mod, UpdatePostDTO p) {
        if (u_repo.existsById(user_id)) {
            if (repo.existsById(p.getId())) {
                Post fromDB = repo.findById(p.getId()).get();
                if (user_id.equals(fromDB.getAuthor().getId()) || u_svc.getRank(user_id).equals(EUserLevel.BOSS)
                        || u_svc.getRank(user_id).equals(EUserLevel.BOSS)) {
                    if (mod.equals("false")) {
                        fromDB.setType(EPostType.valueOf(p.getType()));
                        fromDB.setBody(p.getBody());
                    }
                    fromDB.setTitle(p.getTitle());
                    repo.save(fromDB);
                    return new PostResponse(new ResponseBase(true, "", LocalDateTime.now()), fromDB.getId(),
                            fromDB.getTitle(),
                            fromDB.getBody(), fromDB.getPublishedDate(), fromDB.getType(), fromDB.getAuthor(),
                            fromDB.getReactions(), fromDB.getComments());
                } else {
                    return new PostResponse(new ResponseBase(false, "** User not authorized **", LocalDateTime.now()),
                            null, null,
                            null, null, null, null, null, null);
                }
            } else {
                return new PostResponse(new ResponseBase(false, "** Post not found **", LocalDateTime.now()), null,
                        null,
                        null, null, null, null, null, null);
            }
        } else {
            return new PostResponse(new ResponseBase(false, "** User not found **", LocalDateTime.now()), null, null,
                    null, null, null, null, null, null);
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

    public PostResponse createNewPost(PostDTO pd) {
        SubSection ss = ss_repo.existsById(pd.getSubSection_id()) ? ss_repo.findById(pd.getSubSection_id()).get()
                : null;
        User u = u_repo.existsById(pd.getUser_id()) ? u_repo.findById(pd.getUser_id()).get() : null;

        if (ss != null && u != null) {
            EPostType ept = pd.getType() == null ? EPostType.GENERAL : pd.getType();
            Post post = Post.builder().title(pd.getTitle()).body(pd.getBody()).type(ept).author(u)
                    .sub_section(ss).publishedDate(LocalDateTime.now()).build();
            try {
                repo.save(post);
                return new PostResponse(new ResponseBase(true, "", LocalDateTime.now()), post.getId(),
                        post.getTitle(),
                        post.getBody(), post.getPublishedDate(), post.getType(), post.getAuthor(),
                        post.getReactions(), post.getComments());
            } catch (Exception ex) {
                return new PostResponse(new ResponseBase(false, "** " + ex.getMessage() + " **", LocalDateTime.now()),
                        null, null,
                        null, null, null, null, null, null);
            }

        } else {
            return new PostResponse(new ResponseBase(false, "** User or Sub section not found **", LocalDateTime.now()),
                    null, null,
                    null, null, null, null, null, null);
        }
    }

    public ReactionResponse updateReaction(Long id, Reaction react) {
        if (react_repo.existsById(react.getId())) {
            Reaction fromDB = react_repo.findById(react.getId()).get();
            if (fromDB.getUser().getId().equals(react.getUser().getId())) {
                //
            }
            if (id.equals(react.getId())) {
                react_repo.save(react);
                return new ReactionResponse(new ResponseBase(true, "", LocalDateTime.now()), react.getId(),
                        react.getUser(), react.getType());
            } else {
                throw new CustomException(HttpStatus.BAD_REQUEST, "** ID and Reaction ID does not match **");
            }
        } else {
            return new ReactionResponse(new ResponseBase(true, "** Reaction not found **", LocalDateTime.now()), null,
                    null, null);
        }
    }

    public ReactionResponse addReaction(ReactionDTO r) {
        Post post = repo.existsById(r.getPost_id()) ? repo.findById(r.getPost_id()).get() : null;
        User u = u_repo.existsById(r.getUser_id()) ? u_repo.findById(r.getUser_id()).get() : null;

        if (post != null && u != null) {
            if (post.getReactions().stream().anyMatch(re -> re.getUser().getId().equals(u.getId()))) {
                react_repo.deleteById(post.getReactions().stream().filter(re -> re.getUser().getId() == u.getId())
                        .findFirst().get().getId());
            }
            Reaction reaction = Reaction.builder().user(u).post(post).type(r.getType()).build();
            react_repo.save(reaction);
            return new ReactionResponse(new ResponseBase(true, "", LocalDateTime.now()), reaction.getId(),
                    reaction.getUser(), reaction.getType());
        } else {
            return new ReactionResponse(new ResponseBase(true, "** Unexpected error **", LocalDateTime.now()), null,
                    null, null);
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

    public CommentOut addComment(CommentInDTO comment) {
        Post post = getById(comment.getPost_id());
        User user = u_svc.getById(comment.getUser_id());

        if (post != null && user != null) {
            Comment comm = comm_repo.save(Comment.builder().content(comment.getContent()).user(user).post(post)
                    .publishedDate(LocalDateTime.now()).build());
            return CommentOut.builder().content(comm.getContent()).id(comm.getId())
                    .publishedDate(comm.getPublishedDate()).user(comm.getUser())
                    .user_level(u_svc.getRank(comm.getUser().getId())).build();
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Post or User not found **");
        }
    }

    public CustomResponse deleteComment(Long id) {
        if (comm_repo.existsById(id)) {
            comm_repo.deleteById(id);
            return new CustomResponse(new Date(), "** Comment deleted succesfully **", HttpStatus.OK);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Comment not found **");
        }
    }

    public Post getRandom() {
        return repo.getRandom();
    }

    public PostOutCPaged getPostOut(Long id, Pageable page) {
        Post p = getById(id);
        EUserLevel level = u_svc.getRank(p.getAuthor().getId());
        Page<Comment> comments_page = comm_page.findAllByPostId(id, page);

        Page<CommentOut> comments_page_out = comments_page
                .map(c -> CommentOut.builder().id(c.getId()).content(c.getContent()).user(c.getUser())
                        .publishedDate(c.getPublishedDate()).user_level(u_svc.getRank(c.getUser().getId())).build());

        return new PostOutCPaged(new ResponseBase(true, "", LocalDateTime.now()), p.getId(), p.getTitle(), p.getBody(),
                p.getPublishedDate(), p.getType(),
                p.getAuthor(),
                p.getReactions(), comments_page_out, level, p.getSub_section().getParent_section().getTitle(),
                p.getSub_section().getParent_section().getId(), p.getSub_section().getTitle(),
                p.getSub_section().getId());
    }

    public Page<PostHome> getPostsForHomeOrderDate(Long id, Pageable page) {
        Page<Post> p = page_repo.getPostsHomeForSectionIdDate(id, page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getPostsForHomeOrderReact(Long id, Pageable page) {
        Page<Post> p = page_repo.getPostsHomeForSectionIdReact(id, page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getPostsForHomeOrderComments(Long id, Pageable page) {
        Page<Post> p = page_repo.getPostsHomeForSectionIdComments(id, page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getAllPostsPaged(Pageable page) {
        Page<Post> p = page_repo.findAllOrderDate(page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getPagedByTitle(String title, Pageable page) {
        Page<Post> p = page_repo.findAllByTitle(title, page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getPagedByUsername(String name, Pageable page) {
        Page<Post> p = page_repo.findAllByAuthorName(name, page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getPagedByDate(LocalDateTime date1, LocalDateTime date2, Pageable page) {
        Page<Post> p = page_repo.findAllByPublishedDateBetween(date1, date2, page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getAllPostsPagedReact(Pageable page) {
        Page<Post> p = page_repo.findAllOrderReact(page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }

    public Page<PostHome> getAllPostsPagedComments(Pageable page) {
        Page<Post> p = page_repo.findAllOrderComments(page);
        Page<PostHome> pout = p.map(post -> new PostHome(post.getId(), post.getTitle(), post.getBody(),
                post.getPublishedDate(), post.getType(), post.getAuthor(), post.getReactions(), post.getComments(),
                u_svc.getRank(post.getAuthor().getId())));
        return pout;
    }
}
