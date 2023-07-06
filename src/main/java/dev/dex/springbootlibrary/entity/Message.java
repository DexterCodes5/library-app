package dev.dex.springbootlibrary.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String userEmail;
    private String title;
    private String question;
    private String adminEmail;
    private String response;
    private boolean closed;

    public Message(String title, String question) {
        this.title = title;
        this.question = question;
    }
}
