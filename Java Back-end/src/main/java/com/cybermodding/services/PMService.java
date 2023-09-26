package com.cybermodding.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.PrivateMessage;
import com.cybermodding.repositories.PMRepo;

@Service
public class PMService {
    @Autowired
    PMRepo repo;

    public List<PrivateMessage> getAllPerUser(Long id) {
        return repo.getAllPerUser(id);
    }

    public PrivateMessage markAsViewed(Long id) {
        if (repo.existsById(id)) {
            PrivateMessage pm = repo.findById(id).get();
            pm.setViewed(true);
            return repo.save(pm);
        } else {
            return null;
        }
    }

    public PrivateMessage saveNewPM(PrivateMessage pm) {
        return repo.save(pm);
    }
}
