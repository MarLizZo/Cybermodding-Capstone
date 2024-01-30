package com.cybermodding.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.factory.MiscFactory;
import com.cybermodding.repositories.PMRepo;
import com.cybermodding.responses.ResponsePM;

@Service
@SuppressWarnings("null")
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
            try {
                return MiscFactory.getResponsePM("", repo.save(pm));
            } catch (Exception ex) {
                return MiscFactory.getResponsePM("** " + ex.getMessage() + " **", null);
            }
        } else {
            return MiscFactory.getResponsePM("** Message not found **", null);
        }
    }

    public ResponsePM saveNewPM(PrivateMessage pm) {
        try {
            return MiscFactory.getResponsePM("", repo.save(pm));
        } catch (IllegalArgumentException ex) {
            return MiscFactory.getResponsePM("** Campi obbligatori mancanti **", null);
        } catch (Exception ex) {
            return MiscFactory.getResponsePM("** " + ex.getMessage() + " **", null);
        }
    }
}
