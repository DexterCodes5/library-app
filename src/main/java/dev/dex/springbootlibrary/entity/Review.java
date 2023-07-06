package dev.dex.springbootlibrary.entity;


import lombok.*;
import org.hibernate.annotations.*;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "date")
    @CreationTimestamp
    private Date date;
    @Column(name = "rating")
    private double rating;
    @Column(name = "book_id")
    private long bookId;
    @Column(name = "review_description")
    private String reviewDescription;

    public Review(String userEmail, Date date, double rating, long bookId, String reviewDescription) {
        this.userEmail = userEmail;
        this.date = date;
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}
