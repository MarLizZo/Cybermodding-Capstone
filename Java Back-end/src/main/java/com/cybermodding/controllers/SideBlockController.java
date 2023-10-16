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

import com.cybermodding.entities.SideBlock;
import com.cybermodding.enumerators.ESideBlock;
import com.cybermodding.payload.BlockDTO;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.SideBlockResponse;
import com.cybermodding.services.SideBlockService;

@RestController
@RequestMapping("api/sides")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SideBlockController {

    @Autowired
    SideBlockService svc;

    @GetMapping("")
    public List<SideBlock> getAllSides(@RequestParam(defaultValue = "") String type) {
        if (type.isEmpty()) {
            return svc.getAll();
        }
        return svc.getByType(ESideBlock.valueOf(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SideBlockResponse> getSingleBlock(@PathVariable Long id) {
        return new ResponseEntity<SideBlockResponse>(svc.getById(id), HttpStatus.OK);
    }

    @PostMapping("/new")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SideBlockResponse> createBlock(@RequestBody BlockDTO body) {
        return new ResponseEntity<SideBlockResponse>(svc.saveBlock(body), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomResponse> deleteBlock(@PathVariable Long id) {
        return svc.deleteById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SideBlockResponse> updateBlock(@PathVariable Long id, @RequestBody SideBlock body) {
        return new ResponseEntity<SideBlockResponse>(svc.updateBlock(id, body), HttpStatus.OK);
    }
}
