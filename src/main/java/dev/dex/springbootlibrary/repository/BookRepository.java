package dev.dex.springbootlibrary.repository;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContaining(@RequestParam("title") String title,
                           Pageable pageable);

    Page<Book> findByCategory(@RequestParam("category") String category,
                              Pageable pageable);

    @Query("SELECT b FROM Book b WHERE id in :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookIds);
}
