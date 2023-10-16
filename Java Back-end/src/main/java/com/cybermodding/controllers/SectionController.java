package com.cybermodding.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.cybermodding.entities.Section;
import com.cybermodding.payload.SectionDto;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.SectionResponse;
import com.cybermodding.services.SectionService;

@RestController
@RequestMapping("api/sections")
@CrossOrigin(value = "*", maxAge = 3600)
public class SectionController {
    @Autowired
    SectionService svc;

    @GetMapping("/{id}")
    public ResponseEntity<SectionResponse> getById(@PathVariable Long id) {
        return new ResponseEntity<SectionResponse>(svc.getById(id), HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<List<?>> getAll(@RequestParam(defaultValue = "") String ordered,
            @RequestParam(defaultValue = "") String sub) {
        if (ordered.isEmpty()) {
            return ResponseEntity.ok(svc.getAll());
        } else {
            return sub.isEmpty() ? ResponseEntity.ok(svc.getAllActiveOrdered())
                    : ResponseEntity.ok(svc.getAllOrderedWSub());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomResponse> deleteSection(@PathVariable Long id) {
        return new ResponseEntity<CustomResponse>(svc.deleteById(id), HttpStatus.OK);
    }

    @PostMapping("/new")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SectionResponse> createNewSection(@RequestBody SectionDto s) {
        return new ResponseEntity<SectionResponse>(svc.saveSection(s), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SectionResponse> updateSection(@PathVariable Long id, @RequestBody Section s) {
        return new ResponseEntity<SectionResponse>(svc.updateSection(id, s), HttpStatus.OK);
    }
}
