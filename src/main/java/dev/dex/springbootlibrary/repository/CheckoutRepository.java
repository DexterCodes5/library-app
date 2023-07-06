package dev.dex.springbootlibrary.repository;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.data.jpa.repository.*;

import java.util.*;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndBookId(String userEmail, long bookId);
    List<Checkout> findByUserEmail(String userEmail);
    void deleteByBookId(long bookId);
}
