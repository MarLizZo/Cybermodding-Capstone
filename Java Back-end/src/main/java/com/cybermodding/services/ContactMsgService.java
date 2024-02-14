package com.cybermodding.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cybermodding.entities.ContactMessage;
import com.cybermodding.entities.User;
import com.cybermodding.enumerators.ContactMsgType;
import com.cybermodding.payload.ContactMessageDTO;
import com.cybermodding.repositories.ContactMsgRepo;
import com.cybermodding.repositories.UserRepo;
import com.cybermodding.responses.ContactMsgResponse;
import com.cybermodding.responses.ResponseBase;

@Service
@SuppressWarnings("null")
public class ContactMsgService {
    @Autowired
    ContactMsgRepo repo;
    @Autowired
    UserRepo u_repo;

    public ContactMsgResponse getById(Long id) {
        Optional<ContactMessage> cm = repo.findById(id);

        return cm.isEmpty()
                ? new ContactMsgResponse(new ResponseBase(false, "** Message not found **", LocalDateTime.now()), null)
                : new ContactMsgResponse(new ResponseBase(true, "", LocalDateTime.now()), cm.get());
    }

    public List<ContactMessage> getAll() {
        return repo.findAll();
    }

    public ContactMsgResponse getAllFromUserID(Long id) {
        List<ContactMessage> cms = repo.findByUserID(id);
        return new ContactMsgResponse(new ResponseBase(true, "", LocalDateTime.now()), cms);
    }

    ContactMsgResponse getAllPerType(String type) {
        List<ContactMessage> cms = repo.findByType(ContactMsgType.valueOf(type));
        return new ContactMsgResponse(new ResponseBase(true, "", LocalDateTime.now()), cms);
    }

    ContactMsgResponse getAllPerDates(LocalDateTime start, LocalDateTime end) {
        List<ContactMessage> cms = repo.findByDateBetween(start, end);
        return new ContactMsgResponse(new ResponseBase(true, "", LocalDateTime.now()), cms);
    }

    public ContactMsgResponse setMessageState(Long id, boolean state) {
        Optional<ContactMessage> cm = repo.findById(id);

        if (cm.isPresent()) {
            cm.get().setClosed(state);
            repo.save(cm.get());
            return new ContactMsgResponse(new ResponseBase(true, "", LocalDateTime.now()), cm.get());
        } else {
            return new ContactMsgResponse(new ResponseBase(false, "** Message not found **", LocalDateTime.now()),
                    null);
        }
    }

    public ContactMsgResponse createNewMessage(ContactMessageDTO dto) {
        ContactMsgType type = dto.getType().equals("WORK_WITH_US") ? ContactMsgType.WORK_WITH_US
                : dto.getType().equals("ACCOUNT_ISSUE") ? ContactMsgType.ACCOUNT_ISSUE
                        : dto.getType().equals("TIPS") ? ContactMsgType.TIPS : ContactMsgType.OTHER;

        ContactMessage cm = new ContactMessage();
        if (dto.getUser_id() != 0) {
            Optional<User> u = u_repo.findById(dto.getUser_id());
            cm.setFromUser(u.isPresent() ? u.get() : null);
        } else {
            cm.setFromUser(null);
        }
        cm.setName(dto.getName());
        cm.setType(type);
        cm.setContent(dto.getContent());
        cm.setTitle(dto.getTitle());
        cm.setClosed(false);
        cm.setDate(LocalDateTime.now());

        try {
            repo.save(cm);
            return new ContactMsgResponse(new ResponseBase(true, "",
                    LocalDateTime.now()), cm);
        } catch (Exception ex) {
            return new ContactMsgResponse(new ResponseBase(false, "** Invalid data **",
                    LocalDateTime.now()), null);
        }
    }
}
