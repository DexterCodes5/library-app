package dev.dex.springbootlibrary.service;

import dev.dex.springbootlibrary.entity.*;
import dev.dex.springbootlibrary.repository.*;
import dev.dex.springbootlibrary.responsemodels.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import java.time.*;
import java.time.temporal.*;
import java.util.*;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final ReviewRepository reviewRepository;
    private final HistoryRepository historyRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
                       ReviewRepository reviewRepository, HistoryRepository historyRepository,
                       PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Book checkoutBook(String userEmail, long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (book.isEmpty() || validateCheckout != null || book.get().getCopiesAvailable() == 0) {
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        boolean bookNotReturned = false;
        List<Checkout> booksCheckedOut = checkoutRepository.findByUserEmail(userEmail);
        for (var checkout: booksCheckedOut) {
            long days = ChronoUnit.DAYS.between(LocalDate.now(), LocalDate.parse(checkout.getReturnDate()));
            if (days < 0) {
                bookNotReturned = true;
            }
        }
        Payment payment = paymentRepository.findByUserEmail(userEmail);
        if ((payment != null && payment.getAmount() > 0) || (payment != null && bookNotReturned)) {
            throw new RuntimeException("Outstanding fees");
        }
        if (payment == null) {
            Payment newPayment = new Payment(userEmail, 0);
            paymentRepository.save(newPayment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());
        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(), bookId);
        checkoutRepository.save(checkout);
        return book.get();
    }

    public boolean checkoutBookByUser(String userEmail, long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout == null) {
            return false;
        }
        return true;
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<Checkout> checkouts = checkoutRepository.findByUserEmail(userEmail);

        for (var checkout: checkouts) {
            Optional<Book> book = bookRepository.findById(checkout.getBookId());
            LocalDate returnDate = LocalDate.parse(checkout.getReturnDate());
            long days = ChronoUnit.DAYS.between(LocalDate.now(), returnDate);
            ShelfCurrentLoansResponse shelfCurrentLoansResponse =
                    new ShelfCurrentLoansResponse(book.get(), (int) days);
            shelfCurrentLoansResponses.add(shelfCurrentLoansResponse);
        }
        return shelfCurrentLoansResponses;
    }

    @Transactional
    public void returnBook(String userEmail, long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (checkout == null) {
            throw new Exception("Book is not checked out by user");
        }

        long days = ChronoUnit.DAYS.between(LocalDate.now(), LocalDate.parse(checkout.getReturnDate()));
        if (days < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);
            payment.setAmount(payment.getAmount() + -days);
            paymentRepository.save(payment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
        History history = new History(userEmail, checkout.getCheckoutDate(), LocalDate.now().toString(), book.get());
        historyRepository.save(history);
        checkoutRepository.delete(checkout);
    }

    @Transactional
    public void renewLoan(String userEmail, long bookId) throws Exception {
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (checkout == null) {
            throw new Exception("Book is not checked by user");
        }

        LocalDate returnDate = LocalDate.parse(checkout.getReturnDate());
        long days = ChronoUnit.DAYS.between(LocalDate.now(), returnDate);
        if (days >= 0) {
            checkout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(checkout);
        }
    }

    @Transactional
    public void adminSaveBook(Book book) {
        bookRepository.save(book);
    }

    @Transactional
    public void adminDeleteBook(Book book) {
        checkoutRepository.deleteByBookId(book.getId());
        reviewRepository.deleteByBookId(book.getId());
        historyRepository.deleteByBookId(book.getId());
        bookRepository.delete(book);
    }

}
