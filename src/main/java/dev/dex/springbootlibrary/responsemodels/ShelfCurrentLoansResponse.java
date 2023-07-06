package dev.dex.springbootlibrary.responsemodels;

import dev.dex.springbootlibrary.entity.*;

public record ShelfCurrentLoansResponse(Book book, int daysLeft) {

}
