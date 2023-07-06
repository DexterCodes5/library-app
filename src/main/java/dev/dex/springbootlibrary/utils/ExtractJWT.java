package dev.dex.springbootlibrary.utils;

import java.util.*;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction) {
        token.substring(7);

        String[] chunks = token.split("\\.");
        byte[] payloadBytes = Base64.getUrlDecoder().decode(chunks[1]);

        String payload = new String(payloadBytes);
        String[] entries = payload.split((","));
        Map<String, String> map = new HashMap<>();

        for (final String entry: entries) {
            String[] entrySplit = entry.split(":");
            if (entrySplit[0].equals(extraction)) {

                int remove = 1;
                if (entrySplit[1].endsWith("}")) {
                    remove = 2;
                }
                entrySplit[1] = entrySplit[1].substring(1, entrySplit[1].length() - remove);
                map.put(entrySplit[0], entrySplit[1]);
                break;
            }
        }

        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }
        return null;
    }
}
