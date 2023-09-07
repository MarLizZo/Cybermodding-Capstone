package com.cybermodding.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cybermodding.entities.SubSection;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.payload.PostOutDTO;
import com.cybermodding.payload.SubSectionDto;
import com.cybermodding.payload.SubSectionOutDTO;
import com.cybermodding.services.SubSectionService;
import com.cybermodding.services.UserService;

@RestController
@RequestMapping("/api/subsections")
@CrossOrigin(value = "*", maxAge = 3600)
public class SubSectionController {
    @Autowired
    SubSectionService svc;
    @Autowired
    UserService u_svc;

    @GetMapping("/{id}")
    public ResponseEntity<SubSectionOutDTO> getById(@PathVariable Long id) {
        SubSection sub = svc.getById(id);
        List<PostOutDTO> pout = new ArrayList<>();
        sub.getPosts().forEach(p -> {
            EUserLevel level = u_svc.getRank(p.getAuthor().getId());
            pout.add(new PostOutDTO(p.getId(), p.getTitle(), p.getBody(), p.getPublishedDate(), p.getType(),
                    p.getAuthor(), p.getReactions(), p.getComments(), level,
                    p.getSub_section().getParent_section().getTitle(), p.getSub_section().getParent_section().getId(),
                    p.getSub_section().getTitle(), p.getSub_section().getId()));
        });
        SubSectionOutDTO ss = SubSectionOutDTO.builder().id(sub.getId()).title(sub.getTitle())
                .active(sub.getActive()).description(sub.getDescription()).order_number(sub.getOrder_number())
                .posts(pout)
                .parent_id(sub.getParent_section().getId()).parent_title(sub.getParent_section().getTitle())
                .build();
        return new ResponseEntity<SubSectionOutDTO>(ss, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<List<SubSection>> getSubSectionsList(@RequestParam(defaultValue = "") Long pid) {
        if (pid.toString().equals("")) {
            return new ResponseEntity<List<SubSection>>(svc.getAll(), HttpStatus.OK);
        } else {
            return new ResponseEntity<List<SubSection>>(svc.getSubSectionsOAFromPID(pid), HttpStatus.OK);
        }
    }

    @PostMapping("/new")
    public ResponseEntity<SubSection> createNewSubSection(@RequestBody SubSectionDto s) {
        return new ResponseEntity<SubSection>(svc.saveSubSection(s), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubSection> updateSubSection(@PathVariable Long id, @RequestBody SubSection s) {
        return new ResponseEntity<SubSection>(svc.updateSubSection(id, s), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse> deleteSubSection(@PathVariable Long id) {
        return new ResponseEntity<CustomResponse>(svc.deleteById(id), HttpStatus.OK);
    }
}
