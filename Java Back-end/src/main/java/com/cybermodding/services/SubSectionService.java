package com.cybermodding.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Section;
import com.cybermodding.entities.SubSection;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.repositories.SectionRepo;
import com.cybermodding.repositories.SubSectionRepo;

@Service
public class SubSectionService {
    @Autowired
    SubSectionRepo repo;
    @Autowired
    SectionRepo parent_repo;

    public SubSection getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Sub Section not found **");
        }
    }

    public List<SubSection> getAll() {
        return repo.findAll();
    }

    public SubSection saveSubSection(SubSectionDto ss) {
        Optional<Section> parent = parent_repo.findById(ss.getParent_section_id());
        if (parent.isPresent()) {
            SubSection s = SubSection.builder().title(ss.getTitle()).description(ss.getDescription())
                    .active(ss.getActive())
                    .order_number(ss.getOrder_number()).parent_section(parent.get()).build();
            return repo.save(s);
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "** Parent Section not found **");
        }
    }

    public SubSection updateSubSection(Long id, SubSection ss) {
        if (repo.existsById(id)) {
            if (id.equals(ss.getId())) {
                SubSection upd = repo.save(ss);
                return upd;
            } else {
                throw new CustomException(HttpStatus.BAD_REQUEST, "** Input ID and Sub Section ID does not match **");
            }
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Sub Section not found **");
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Sub Section deleted succesfully **", HttpStatus.OK);
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Sub Section not found **");
        }
    }

    public List<SubSection> getSubSectionsOAFromPID(Long id) {
        return repo.findByActiveOrderedForSectionId(id);
    }

    public SubSection getRandom() {
        return repo.getRandom();
    }
}
