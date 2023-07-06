package dev.dex.springbootlibrary.repository;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.web.bind.annotation.*;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByUserEmail(@RequestParam String userEmail, Pageable pageable);

    Page<Message> findByClosed(@RequestParam boolean closed, Pageable pageable);
}
