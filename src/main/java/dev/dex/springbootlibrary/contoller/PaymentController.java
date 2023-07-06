package dev.dex.springbootlibrary.contoller;

import com.stripe.exception.*;
import com.stripe.model.*;
import dev.dex.springbootlibrary.requestmodels.*;
import dev.dex.springbootlibrary.service.*;
import dev.dex.springbootlibrary.utils.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("https://localhost:3000")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest) throws StripeException {
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);

        return ResponseEntity.status(HttpStatus.OK).body(paymentIntent.toJson());
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<?> paymentComplete(@RequestHeader("Authorization") String token) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new RuntimeException("User email is missing");
        }
        paymentService.paymentComplete(userEmail);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
