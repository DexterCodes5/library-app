package dev.dex.springbootlibrary.repository;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.data.jpa.repository.*;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByUserEmail(String userEmail);
}
