package com.cybermodding.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.Section;
import com.cybermodding.enumerators.ESectionCategory;
import com.cybermodding.exception.MyAPIException;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.SectionDto;
import com.cybermodding.repositories.SectionRepo;

@Service
public class SectionService {
    @Autowired
    SectionRepo repo;

    public Section getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Section not found **");
        }
    }

    public CustomResponse deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return new CustomResponse(new Date(), "** Section deleted succesfully **", HttpStatus.OK);
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Section not found **");
        }
    }

    public Section saveSection(SectionDto s) {
        Section sec = new Section(s.getTitle(), s.getDescription(), s.getActive(), s.getCategory(),
                s.getOrder_number());
        return repo.save(sec);
    }

    public CustomResponse updateSection(Long id, Section s) {
        if (repo.existsById(id)) {
            if (id.equals(s.getId())) {
                repo.save(s);
                return new CustomResponse(new Date(), "** Section updated succesfully **", HttpStatus.OK);
            } else {
                return new CustomResponse(new Date(), "** Input ID and Section ID does not match **",
                        HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new MyAPIException(HttpStatus.BAD_REQUEST, "** Section not found **");
        }
    }

    public List<Section> getByCategory(ESectionCategory cat) {
        return repo.findByCategory(cat);
    }

    public List<Section> getAll() {
        return repo.findAll();
    }

    public List<Section> getAllActiveOrdered() {
        return repo.findByActiveOrdered();
    }
}
