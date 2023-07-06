package dev.dex.springbootlibrary.contoller;

import dev.dex.springbootlibrary.entity.*;
import dev.dex.springbootlibrary.requestmodels.*;
import dev.dex.springbootlibrary.service.*;
import dev.dex.springbootlibrary.utils.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin("https://localhost:3000")
public class MessagesController {
    private final MessageService messageService;

    public MessagesController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure")
    public ResponseEntity<?> postMessage(@RequestHeader("Authorization") String token,
                                         @RequestBody Message message) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        messageService.saveMessage(message, userEmail);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/secure/admin")
    public ResponseEntity<?> respondMessage(@RequestHeader("Authorization") String token,
                                            @RequestBody AdminRequest adminRequest) throws Exception {
        String adminEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String userType = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (!userType.equals("admin")) {
            throw new Exception("User is not admin");
        }

        messageService.respondMessage(adminRequest, adminEmail);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
