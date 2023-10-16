package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.repositories.PMRepo;
import com.cybermodding.responses.ResponseBase;
import com.cybermodding.responses.ResponsePM;

@Service
public class PMService {
    @Autowired
    PMRepo repo;

    public List<PrivateMessage> getAllPerUser(Long id) {
        return repo.getAllPerUser(id);
    }

    public ResponsePM markAsViewed(Long id) {
        if (repo.existsById(id)) {
            PrivateMessage pm = repo.findById(id).get();
            pm.setViewed(true);
            PrivateMessage savedPM = repo.save(pm);
            if (savedPM.getId() != null) {
                return new ResponsePM(new ResponseBase(true, "", LocalDateTime.now()), savedPM.getId(),
                        savedPM.getTitle(), savedPM.getContent(), savedPM.getSender_user(), savedPM.getRecipient_user(),
                        savedPM.getDate(), savedPM.getViewed());
            } else {
                return new ResponsePM(new ResponseBase(false, "** Unexpected error **", LocalDateTime.now()), null,
                        null,
                        null, null, null, null, null);
            }
        } else {
            return new ResponsePM(new ResponseBase(false, "** Message not found **", LocalDateTime.now()), null, null,
                    null, null, null, null, null);
        }
    }

    public ResponsePM saveNewPM(PrivateMessage pm) {
        PrivateMessage savedPM = repo.save(pm);
        if (savedPM.getId() != null) {
            return new ResponsePM(new ResponseBase(true, "", LocalDateTime.now()), savedPM.getId(), savedPM.getTitle(),
                    savedPM.getContent(), savedPM.getSender_user(), savedPM.getRecipient_user(), savedPM.getDate(),
                    savedPM.getViewed());
        } else {
            return new ResponsePM(new ResponseBase(false, "** Unexpected error **", LocalDateTime.now()), null, null,
                    null, null, null, null, null);
        }
    }
}
