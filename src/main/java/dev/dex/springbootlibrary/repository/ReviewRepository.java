package dev.dex.springbootlibrary.repository;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.web.bind.annotation.*;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByBookId(@RequestParam("bookId") long bookId, Pageable pageable);
    Review findByUserEmailAndBookId(String userEmail, long bookId);
    void deleteByBookId(long bookId);
}
