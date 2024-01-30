package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Section;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.factory.UserFactory;
import com.cybermodding.payload.SectionDto;
import com.cybermodding.repositories.SectionRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.SectionResponse;
import com.cybermodding.responses.SectionWithSub;

@Service
@SuppressWarnings("null")
public class SectionService {
    @Autowired
    SectionRepo repo;
    @Autowired
    UserRepo u_repo;
    @Autowired
    UserService u_svc;

    public SectionResponse getById(Long id) {
        if (repo.existsById(id)) {
            Section s = repo.findById(id).get();
            return new SectionResponse(new ResponseBase(true, "", LocalDateTime.now()), s.getId(), s.getTitle(),
                    s.getDescription(), s.getActive(), s.getOrder_number());
        } else {
            return new SectionResponse(new ResponseBase(false, "** Section not found **", LocalDateTime.now()), null,
                    null, null, null, null);
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Section deleted succesfully **", HttpStatus.OK);
        } else {
            return new CustomResponse(new Date(), "** Section not found **", HttpStatus.NOT_FOUND);
        }
    }

    public SectionResponse saveSection(SectionDto s) {
        try {
            Section sec = repo.save(new Section(s.getTitle(), s.getDescription(), s.getActive(), s.getOrder_number()));
            return new SectionResponse(new ResponseBase(true, "", LocalDateTime.now()), sec.getId(),
                    sec.getTitle(), sec.getDescription(), sec.getActive(), sec.getOrder_number());
        } catch (IllegalArgumentException ex) {
            return new SectionResponse(new ResponseBase(false, "** Campi obbligatori mancanti **", LocalDateTime.now()),
                    null, null, null, null, null);
        } catch (Exception ex) {
            return new SectionResponse(new ResponseBase(false, "** " + ex.getMessage() + " **", LocalDateTime.now()),
                    null, null, null, null, null);
        }
    }

    public SectionResponse updateSection(Long id, Section s) {
        if (u_repo.existsById(id)) {
            if (UserFactory.getRank(u_repo.findById(id).get()).equals(EUserLevel.BOSS)) {
                if (repo.existsById(s.getId())) {
                    Section fromDB = repo.findById(id).get();
                    fromDB.setTitle(s.getTitle());
                    fromDB.setDescription(s.getDescription());
                    fromDB.setActive(s.getActive());
                    fromDB.setOrder_number(s.getOrder_number());
                    repo.save(fromDB);
                    return new SectionResponse(new ResponseBase(true, "", LocalDateTime.now()), fromDB.getId(),
                            fromDB.getTitle(), fromDB.getDescription(), fromDB.getActive(), fromDB.getOrder_number());
                } else {
                    return new SectionResponse(new ResponseBase(false, "** Section not found **", LocalDateTime.now()),
                            null, null, null, null, null);
                }
            } else {
                return new SectionResponse(
                        new ResponseBase(false, "** User not found or authorized **", LocalDateTime.now()), null,
                        null, null, null, null);
            }
        } else {
            return new SectionResponse(
                    new ResponseBase(false, "** User not found or authorized **", LocalDateTime.now()), null,
                    null, null, null, null);
        }
    }

    public List<Section> getAll() {
        return repo.findAll();
    }

    public List<Section> getAllActiveOrdered() {
        return repo.findByActiveOrdered();
    }

    public List<SectionWithSub> getAllOrderedWSub() {
        List<Section> ls = repo.findByOrdered();
        List<SectionWithSub> outls = new ArrayList<>();
        ls.forEach(el -> outls.add(new SectionWithSub(el.getId(), el.getTitle(), el.getDescription(), el.getActive(),
                el.getOrder_number(), el.getSub_sections())));
        return outls;
    }
}
