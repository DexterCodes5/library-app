package dev.dex.springbootlibrary.service;

import dev.dex.springbootlibrary.entity.*;
import dev.dex.springbootlibrary.repository.*;
import dev.dex.springbootlibrary.requestmodels.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.util.*;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public void saveReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.bookId());
        if (validateReview != null) {
            throw new Exception("Review already created");
        }

        reviewRepository.save(new Review(userEmail, new Date(), reviewRequest.rating(), reviewRequest.bookId(),
                reviewRequest.reviewDescription().isPresent() ? reviewRequest.reviewDescription().get() : null));
    }

    public boolean isReviewedByUser(String userEmail, long bookId) {
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateReview != null) {
            return true;
        }
        return false;
    }
}
