package dev.dex.springbootlibrary.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "checkout")
@Data
@NoArgsConstructor
public class Checkout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "return_date")
    private String returnDate;

    @Column(name = "book_id")
    private long bookId;

    public Checkout(String userEmail, String checkoutDate, String returnDate, long bookId) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnDate = returnDate;
        this.bookId = bookId;
    }
}
