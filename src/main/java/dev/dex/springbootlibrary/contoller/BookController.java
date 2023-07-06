package dev.dex.springbootlibrary.contoller;

import dev.dex.springbootlibrary.entity.*;
import dev.dex.springbootlibrary.service.*;
import dev.dex.springbootlibrary.utils.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@CrossOrigin("https://localhost:3000")
public class BookController {
    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public ResponseEntity<Book> checkoutBook(@RequestHeader("Authorization") String token,
                                             @RequestParam long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return ResponseEntity.status(HttpStatus.OK).body(bookService.checkoutBook(userEmail, bookId));
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public ResponseEntity<Boolean> checkoutBookByUser(@RequestHeader("Authorization") String token,
                                                      @RequestParam long bookId) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return ResponseEntity.status(HttpStatus.OK).body(bookService.checkoutBookByUser(userEmail, bookId));
    }

    @GetMapping("/secure/currentloans/count")
    public ResponseEntity<Integer> currentLoansCount(@RequestHeader("Authorization") String token) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return ResponseEntity.status(HttpStatus.OK).body(bookService.currentLoansCount(userEmail));
    }

    @GetMapping("/secure/currentloans")
    public ResponseEntity<?> getLoans(@RequestHeader("Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return ResponseEntity.status(HttpStatus.OK).body(bookService.currentLoans(userEmail));
    }

    @PutMapping("/secure/return")
    public ResponseEntity<?> returnBook(@RequestHeader("Authorization") String token, @RequestParam long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/secure/renew")
    public ResponseEntity<?> renewBook(@RequestHeader("Authorization") String token, @RequestParam long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.renewLoan(userEmail, bookId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/secure/admin")
    public ResponseEntity<?> adminPostBook(@RequestHeader("Authorization") String token,
                                      @RequestBody Book book) {
        String userType = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (!userType.equals("admin")) {
            throw new RuntimeException("User is not admin");
        }

        bookService.adminSaveBook(book);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/secure/admin")
    public ResponseEntity<?> adminPutQuantity(@RequestHeader("Authorization") String token,
                                              @RequestBody Book book) {
        String userType = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (!userType.equals("admin")) {
            throw new RuntimeException("User is not admin");
        }
        bookService.adminSaveBook(book);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/secure/admin")
    public ResponseEntity<?> adminDeleteBook(@RequestHeader("Authorization") String token,
                                             @RequestBody Book book) {
        String userType = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (!userType.equals("admin")) {
            throw new RuntimeException("User is not admin");
        }

        bookService.adminDeleteBook(book);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
