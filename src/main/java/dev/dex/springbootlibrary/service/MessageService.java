package dev.dex.springbootlibrary.service;

import dev.dex.springbootlibrary.entity.*;
import dev.dex.springbootlibrary.repository.*;
import dev.dex.springbootlibrary.requestmodels.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import java.util.*;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Transactional
     public void saveMessage(Message message, String userEmail) throws Exception {
        if (!message.getUserEmail().equals(userEmail)) {
            throw new Exception("Message userEmail is different from authorization userEmail");
        }
        messageRepository.save(message);
     }

     @Transactional
    public void respondMessage(AdminRequest adminRequest, String adminEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminRequest.id());
        if (message.isEmpty()) {
            throw new RuntimeException("Message doesn't exist");
        }

        message.get().setAdminEmail(adminEmail);
        message.get().setResponse(adminRequest.response());
        message.get().setClosed(true);
        messageRepository.save(message.get());
     }
}
