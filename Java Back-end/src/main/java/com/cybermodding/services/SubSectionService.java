package com.cybermodding.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Comment;
import com.cybermodding.entities.Post;
import com.cybermodding.entities.Section;
import com.cybermodding.entities.SubSection;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.exception.CustomException;
import com.cybermodding.factory.MiscFactory;
import com.cybermodding.factory.PostsFactory;
import com.cybermodding.factory.UserFactory;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.repositories.SectionRepo;
import com.cybermodding.repositories.SubSectionRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CommentOut;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.PostOut;
import com.cybermodding.responses.SubSectionOut;
import com.cybermodding.responses.SubSectionResponse;

@Service
@SuppressWarnings("null")
public class SubSectionService {
    @Autowired
    SubSectionRepo repo;
    @Autowired
    SectionRepo parent_repo;
    @Autowired
    UserService u_svc;
    @Autowired
    UserRepo u_repo;

    public SubSection getById(Long id) {
        if (repo.existsById(id)) {
            SubSection ss = repo.findById(id).get();

            ss.getPosts().sort(new Comparator<Post>() {
                @Override
                public int compare(Post p1, Post p2) {
                    return p2.getPublishedDate().compareTo(p1.getPublishedDate());
                }
            });
            return ss;
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Sub Section not found **");
        }
    }

    public SubSectionOut getSSOut(Long id) {
        SubSection sub = getById(id);
        List<PostOut> pout = new ArrayList<>();

        if (sub.getPosts().size() != 0) {
            sub.getPosts().forEach(post -> {
                if (post.getComments().size() != 0) {
                    Comment last = post.getComments().get(0);
                    CommentOut cmOut = PostsFactory.getCommentOut(last);
                    pout.add(PostsFactory.getPostOut(post, cmOut));
                } else {
                    pout.add(PostsFactory.getPostOut(post, null));
                }
            });
        }

        return SubSectionOut.builder().id(sub.getId()).title(sub.getTitle())
                .active(sub.getActive()).description(sub.getDescription()).order_number(sub.getOrder_number())
                .posts(pout)
                .parent_id(sub.getParent_section().getId()).parent_title(sub.getParent_section().getTitle())
                .build();
    }

    public List<SubSection> getAll() {
        return repo.findAll();
    }

    public SubSectionResponse saveSubSection(SubSectionDto ss) {
        Optional<Section> parent = parent_repo.findById(ss.getParent_section_id());
        if (parent.isPresent()) {
            SubSection s = SubSection.builder().title(ss.getTitle()).description(ss.getDescription())
                    .active(ss.getActive())
                    .order_number(ss.getOrder_number()).parent_section(parent.get()).build();

            try {
                return MiscFactory.getSubSectionResponse("", repo.save(s));
            } catch (Exception ex) {
                return MiscFactory.getSubSectionResponse("** " + ex.getMessage() + " **", null);
            }
        } else {
            return MiscFactory.getSubSectionResponse("** Parent section not found **", null);
        }
    }

    public SubSectionResponse updateSubSection(Long id, SubSection ss) {
        if (repo.existsById(ss.getId())) {
            if (u_repo.existsById(id)) {
                if (UserFactory.getRank(u_repo.findById(id).get()).equals(EUserLevel.BOSS)) {
                    SubSection fromDB = repo.findById(ss.getId()).get();
                    fromDB.setActive(ss.getActive());
                    fromDB.setDescription(ss.getDescription());
                    fromDB.setOrder_number(ss.getOrder_number());
                    fromDB.setTitle(ss.getTitle());
                    return MiscFactory.getSubSectionResponse("", repo.save(fromDB));
                } else {
                    return MiscFactory.getSubSectionResponse("** User not found or Authorized **", null);
                }
            } else {
                return MiscFactory.getSubSectionResponse("** User not found or Authorized **", null);
            }
        } else {
            return MiscFactory.getSubSectionResponse("** Sub Sectionnot found **", null);
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Sub Section deleted succesfully **", HttpStatus.OK);
        } else {
            return new CustomResponse(new Date(), "** Sub section not found **", HttpStatus.BAD_REQUEST);
        }
    }

    public List<SubSection> getSubSectionsOAFromPID(Long id) {
        return repo.findByActiveOrderedForSectionId(id);
    }

    public SubSection getRandom() {
        return repo.getRandom();
    }
}
