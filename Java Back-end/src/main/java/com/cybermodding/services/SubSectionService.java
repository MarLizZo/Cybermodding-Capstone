package com.cybermodding.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.SubSection;
import com.cybermodding.exception.MyAPIException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.repositories.SubSectionRepo;

@Service
public class SubSectionService {
    @Autowired
    SubSectionRepo repo;

    public SubSection getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Sub Section not found **");
        }
    }

    public List<SubSection> getAll() {
        return repo.findAll();
    }

    public SubSection saveSubSection(SubSectionDto ss) {
        SubSection s = SubSection.builder().title(ss.getTitle()).description(ss.getDescription()).active(ss.getActive())
                .order_number(ss.getOrder_number()).parent_section(ss.getParent_section()).build();
        return repo.save(s);
    }

    public SubSection updateSubSection(Long id, SubSection ss) {
        if (repo.existsById(id)) {
            if (id.equals(ss.getId())) {
                SubSection upd = repo.save(ss);
                return upd;
            } else {
                throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Input ID and Sub Section ID does not match **");
            }
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Sub Section not found **");
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Sub Section deleted succesfully **", HttpStatus.OK);
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Sub Section not found **");
        }
    }

    public List<SubSection> getSubSectionsOAFromPID(Long id) {
        return repo.findByActiveOrderedForSectionId(id);
    }
}
