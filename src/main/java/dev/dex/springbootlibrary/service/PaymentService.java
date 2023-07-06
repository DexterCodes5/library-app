package dev.dex.springbootlibrary.service;

import com.stripe.*;
import com.stripe.exception.*;
import com.stripe.model.*;
import dev.dex.springbootlibrary.entity.*;
import dev.dex.springbootlibrary.repository.*;
import dev.dex.springbootlibrary.requestmodels.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.util.*;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret}") String secretKey) {
        this.paymentRepository = paymentRepository;
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap();
        params.put("amount", paymentInfoRequest.amount());
        params.put("currency", paymentInfoRequest.currency());
        params.put("payment_method_types", paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    public void paymentComplete(String userEmail) {
        Payment payment = paymentRepository.findByUserEmail(userEmail);
        if (payment == null) {
            throw new RuntimeException("User doesn't have fees");
        }

        payment.setAmount(0);
        paymentRepository.save(payment);
    }
}
