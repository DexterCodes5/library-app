package dev.dex.springbootlibrary.requestmodels;

public record PaymentInfoRequest(int amount, String currency, String receiptEmail) {
}
