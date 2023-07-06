package dev.dex.springbootlibrary.contoller;

import dev.dex.springbootlibrary.requestmodels.*;
import dev.dex.springbootlibrary.service.*;
import dev.dex.springbootlibrary.utils.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("https://localhost:3000")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/isreviewed/byuser")
    public ResponseEntity<?> isReviewedByUser(@RequestHeader("Authorization") String token,
                                            @RequestParam long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User Email is missing");
        }
        return ResponseEntity.status(HttpStatus.OK).body(reviewService.isReviewedByUser(userEmail, bookId));
    }

    @PostMapping("/secure")
    public ResponseEntity<?> postReview(@RequestHeader("Authorization") String token,
                                        @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User Email is missing");
        }
        reviewService.saveReview(userEmail, reviewRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
