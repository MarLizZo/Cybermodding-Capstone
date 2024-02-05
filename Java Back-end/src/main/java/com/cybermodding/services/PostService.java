package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
import com.cybermodding.factory.PostsFactory;
import com.cybermodding.factory.UserFactory;
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

import jakarta.transaction.Transactional;

import com.cybermodding.responses.PostOutCPaged;
import com.cybermodding.responses.PostResponse;

@Service
@SuppressWarnings("null")
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
        return repo.existsById(id) ? repo.findById(id).get() : null;
    }

    public Reaction getReactById(Long id) {
        return react_repo.existsById(id) ? react_repo.findById(id).get() : null;
    }

    public PostWithID getByIdPout(Long id) {
        Post p = getById(id);
        if (p != null) {
            return PostsFactory.getPostWithID("", p);
        } else {
            return PostsFactory.getPostWithID("** Post not found **", p);
        }
    }

    public List<Post> getAllBySSId(Long ss_id) {
        return repo.findAllBySubSId(ss_id);
    }

    public PostResponse updatePost(Long user_id, String mod, UpdatePostDTO p) {
        if (u_repo.existsById(user_id)) {
            Post fromDB = getById(p.getId());
            if (fromDB != null) {
                if (user_id.equals(fromDB.getAuthor().getId())
                        || UserFactory.getRank(fromDB.getAuthor()).equals(EUserLevel.BOSS)
                        || UserFactory.getRank(fromDB.getAuthor()).equals(EUserLevel.BOSS)) {
                    if (mod.equals("false")) {
                        fromDB.setType(EPostType.valueOf(p.getType()));
                        fromDB.setBody(p.getBody());
                    }
                    fromDB.setTitle(p.getTitle());
                    repo.save(fromDB);
                    return PostsFactory.getPostResponse("", fromDB);
                } else {
                    return PostsFactory.getPostResponse("** User not authorized **", fromDB);
                }
            } else {
                return PostsFactory.getPostResponse("** Post not found **", fromDB);
            }
        } else {
            return PostsFactory.getPostResponse("** User not found **", null);
        }
    }

    private void clearPostEntity(Post p) {
        User u = p.getAuthor();
        u.getPosts().remove(p);
        u_repo.save(u);

        SubSection ss = p.getSub_section();
        ss.getPosts().remove(p);
        ss_repo.save(ss);
    }

    @Transactional
    public CustomResponse deletePost(Long id) {
        Post p = getById(id);
        if (p != null) {
            clearPostEntity(p);
            repo.delete(p);
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
                return PostsFactory.getPostResponse("", repo.save(post));
            } catch (Exception ex) {
                return PostsFactory.getPostResponse("** " + ex.getMessage() + " **", null);
            }

        } else {
            return PostsFactory.getPostResponse("** User or Sub section not found **", null);
        }
    }

    public ReactionResponse updateReaction(Long id, Reaction react) {
        Reaction fromDB = getReactById(react.getId());
        if (fromDB != null) {
            if (fromDB.getUser().getId().equals(react.getUser().getId())) {
                if (id.equals(react.getId())) {
                    fromDB.setType(react.getType());
                    return PostsFactory.getReactionResponse("", react_repo.save(fromDB));
                } else {
                    return PostsFactory.getReactionResponse("** Bad request **", null);
                }
            } else {
                return PostsFactory.getReactionResponse("** User not Authorized **", null);
            }
        } else {
            return PostsFactory.getReactionResponse("** Reaction not found **", null);
        }
    }

    public ReactionResponse addReaction(ReactionDTO r) {
        Post post = getById(r.getPost_id());
        User u = u_svc.getById(r.getUser_id());

        if (post != null && u != null) {
            // remove if user already added a reaction. Should not happen tho
            Optional<Reaction> reactOpt = post.getReactions().stream()
                    .filter(re -> re.getUser().getId().equals(u.getId()))
                    .findFirst();
            reactOpt.ifPresent(reaction -> react_repo.deleteById(reaction.getId()));

            Reaction reaction = Reaction.builder().user(u).post(post).type(r.getType()).build();
            return PostsFactory.getReactionResponse("", react_repo.save(reaction));
        } else {
            return PostsFactory.getReactionResponse("** Bad request **", null);
        }
    }

    public CustomResponse removeReaction(Long id) {
        Reaction r = getReactById(id);
        if (r != null) {
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
                    .user_level(UserFactory.getRank(comm.getUser())).build();
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Post or User not found **");
        }
    }

    private void clearCommentEntity(Comment c) {
        User u = c.getUser();
        u.getComments().remove(c);
        u_repo.save(u);

        Post p = c.getPost();
        p.getComments().remove(c);
        repo.save(p);
    }

    @Transactional
    public CustomResponse deleteComment(Long id) {
        if (comm_repo.existsById(id)) {
            Comment c = comm_repo.findById(id).get();
            clearCommentEntity(c);
            comm_repo.delete(c);
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
        if (p != null) {
            Page<Comment> comments_page = comm_page.findAllByPostId(id, page);
            return PostsFactory.getPostOutCPaged("", p, comments_page);
        }
        return PostsFactory.getPostOutCPaged("** Post not found **", null, null);
    }

    public Page<PostHome> getPostsForHomeOrderDate(Long id, Pageable page) {
        Page<Post> p = page_repo.getPostsHomeForSectionIdDate(id, page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getPostsForHomeOrderReact(Long id, Pageable page) {
        Page<Post> p = page_repo.getPostsHomeForSectionIdReact(id, page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getPostsForHomeOrderComments(Long id, Pageable page) {
        Page<Post> p = page_repo.getPostsHomeForSectionIdComments(id, page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getAllPostsPaged(Pageable page) {
        Page<Post> p = page_repo.findAllOrderDate(page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getPagedByTitle(String title, Pageable page) {
        Page<Post> p = page_repo.findAllByTitle(title, page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getPagedByUsername(String name, Pageable page) {
        Page<Post> p = page_repo.findAllByAuthorName(name, page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getPagedByDate(LocalDateTime date1, LocalDateTime date2, Pageable page) {
        Page<Post> p = page_repo.findAllByPublishedDateBetween(date1, date2, page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getAllPostsPagedReact(Pageable page) {
        Page<Post> p = page_repo.findAllOrderReact(page);
        return PostsFactory.getPagePostHome(p);
    }

    public Page<PostHome> getAllPostsPagedComments(Pageable page) {
        Page<Post> p = page_repo.findAllOrderComments(page);
        return PostsFactory.getPagePostHome(p);
    }
}
