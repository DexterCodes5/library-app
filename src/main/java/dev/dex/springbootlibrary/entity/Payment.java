package dev.dex.springbootlibrary.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String userEmail;
    private double amount;

    public Payment(String userEmail, double amount) {
        this.userEmail = userEmail;
        this.amount = amount;
    }
}
