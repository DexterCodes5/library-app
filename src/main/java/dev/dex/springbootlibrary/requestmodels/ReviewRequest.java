package dev.dex.springbootlibrary.requestmodels;

import java.util.*;

public record ReviewRequest(double rating,
                            long bookId,
                            Optional<String> reviewDescription) {
}
