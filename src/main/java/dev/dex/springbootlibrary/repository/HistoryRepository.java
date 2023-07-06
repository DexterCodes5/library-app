package dev.dex.springbootlibrary.repository;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.web.bind.annotation.*;

public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findBooksByUserEmail(@RequestParam String userEmail, Pageable pageable);
    void deleteByBookId(long bookId);
}
