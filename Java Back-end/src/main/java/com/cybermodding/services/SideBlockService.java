package com.cybermodding.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.SideBlock;
import com.cybermodding.enumerators.ESideBlock;
import com.cybermodding.exception.CustomException;
import com.cybermodding.payload.BlockDTO;
import com.cybermodding.payload.CustomResponse;
import com.cybermodding.repositories.SideBlockRepo;

@Service
public class SideBlockService {
    @Autowired
    SideBlockRepo repo;

    public SideBlock getById(Long id) {
        if (repo.existsById(id)) {
            return repo.findById(id).get();
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Side Block not found **");
        }
    }

    public ResponseEntity<CustomResponse> deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            CustomResponse cr = new CustomResponse(new Date(), "** Side Block deleted succesfully **", HttpStatus.OK);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.OK);
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "** Side Block not found **");
        }
    }

    public ResponseEntity<SideBlock> saveBlock(BlockDTO s) {
        SideBlock createdS = repo.save(SideBlock.builder().title(s.getTitle()).active(s.getActive())
                .content(s.getContent()).e_block_type(s.getE_block_type()).order_number(s.getOrder_number()).build());
        return new ResponseEntity<SideBlock>(createdS, HttpStatus.CREATED);
    }

    public ResponseEntity<CustomResponse> updateBlock(Long id, SideBlock s) {
        if (repo.existsById(id)) {
            if (id.equals(s.getId())) {
                SideBlock fromDB = repo.findById(s.getId()).get();
                fromDB.setActive(s.getActive());
                fromDB.setContent(s.getContent());
                fromDB.setE_block_type(s.getE_block_type());
                fromDB.setOrder_number(s.getOrder_number());
                fromDB.setTitle(s.getTitle());
                repo.save(fromDB);
                CustomResponse cr = new CustomResponse(new Date(), "** Side block updated succesfully **",
                        HttpStatus.OK);
                return new ResponseEntity<CustomResponse>(cr, HttpStatus.OK);
            } else {
                CustomResponse cr = new CustomResponse(new Date(), "** Input ID and Block ID does not match **",
                        HttpStatus.BAD_REQUEST);
                return new ResponseEntity<CustomResponse>(cr, HttpStatus.BAD_REQUEST);
            }
        } else {
            CustomResponse cr = new CustomResponse(new Date(), "** Block not found **",
                    HttpStatus.NOT_FOUND);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.NOT_FOUND);
        }
    }

    public List<SideBlock> getAll() {
        return repo.findAll();
    }

    public List<SideBlock> getByActive() {
        return repo.findByActive(true);
    }

    public List<SideBlock> getByInactive() {
        return repo.findByActive(false);
    }

    public List<SideBlock> getByType(ESideBlock etype) {
        return repo.findByESideBlockType(etype);
    }
}
