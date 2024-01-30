package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.SideBlock;
import com.cybermodding.enumerators.ESideBlock;
import com.cybermodding.enumerators.EUserLevel;
import com.cybermodding.factory.UserFactory;
import com.cybermodding.payload.BlockDTO;
import com.cybermodding.repositories.SideBlockRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.CustomResponse;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.SideBlockResponse;

@Service
@SuppressWarnings("null")
public class SideBlockService {
    @Autowired
    SideBlockRepo repo;
    @Autowired
    UserRepo u_repo;
    @Autowired
    UserService u_svc;

    public SideBlockResponse getById(Long id) {
        if (repo.existsById(id)) {
            SideBlock s = repo.findById(id).get();
            return new SideBlockResponse(new ResponseBase(true, "", LocalDateTime.now()), s.getId(), s.getTitle(),
                    s.getContent(), s.getActive(), s.getE_block_type(), s.getOrder_number());
        } else {
            return new SideBlockResponse(new ResponseBase(false, "** Side block not found **", LocalDateTime.now()),
                    null, null, null, null, null, null);
        }
    }

    public ResponseEntity<CustomResponse> deleteById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            CustomResponse cr = new CustomResponse(new Date(), "** Side Block deleted succesfully **", HttpStatus.OK);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.OK);
        } else {
            CustomResponse cr = new CustomResponse(new Date(), "** Side Block not found **", HttpStatus.BAD_GATEWAY);
            return new ResponseEntity<CustomResponse>(cr, HttpStatus.BAD_REQUEST);
        }
    }

    public SideBlockResponse saveBlock(BlockDTO s) {
        try {
            SideBlock createdS = repo.save(SideBlock.builder().title(s.getTitle()).active(s.getActive())
                    .content(s.getContent()).e_block_type(s.getE_block_type()).order_number(s.getOrder_number())
                    .build());
            return new SideBlockResponse(new ResponseBase(true, "", LocalDateTime.now()), createdS.getId(),
                    createdS.getTitle(),
                    createdS.getContent(), createdS.getActive(), createdS.getE_block_type(),
                    createdS.getOrder_number());
        } catch (Exception ex) {
            return new SideBlockResponse(new ResponseBase(false, "** " + ex.getMessage() + " **", LocalDateTime.now()),
                    null, null, null, null, null, null);
        }
    }

    public SideBlockResponse updateBlock(Long id, SideBlock s) {
        if (repo.existsById(s.getId())) {
            if (u_repo.existsById(id)) {
                if (UserFactory.getRank(u_repo.findById(id).get()).equals(EUserLevel.BOSS)) {
                    SideBlock fromDB = repo.findById(s.getId()).get();
                    fromDB.setActive(s.getActive());
                    fromDB.setContent(s.getContent());
                    fromDB.setE_block_type(s.getE_block_type());
                    fromDB.setOrder_number(s.getOrder_number());
                    fromDB.setTitle(s.getTitle());
                    repo.save(fromDB);

                    return new SideBlockResponse(new ResponseBase(true, "", LocalDateTime.now()), fromDB.getId(),
                            fromDB.getTitle(),
                            fromDB.getContent(), fromDB.getActive(), fromDB.getE_block_type(),
                            fromDB.getOrder_number());
                } else {
                    return new SideBlockResponse(
                            new ResponseBase(false, "** User not found or Authorized **", LocalDateTime.now()),
                            null, null, null, null, null, null);
                }
            } else {
                return new SideBlockResponse(new ResponseBase(false, "** Block not found **", LocalDateTime.now()),
                        null, null, null, null, null, null);
            }
        } else {
            return new SideBlockResponse(
                    new ResponseBase(false, "** User not found or Authorized **", LocalDateTime.now()),
                    null, null, null, null, null, null);
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
