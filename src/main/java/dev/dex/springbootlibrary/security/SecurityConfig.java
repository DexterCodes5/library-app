package dev.dex.springbootlibrary.security;

import com.okta.spring.boot.oauth.*;
import org.springframework.context.annotation.*;
import org.springframework.security.config.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.web.*;
import org.springframework.web.accept.*;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        String[] secureEndpoints = {"/api/books/secure/**", "/api/reviews/secure/**",
                "/api/messages/secure/**", "/api/payments/secure/**"};
        // Disable Cross Site Request Forgery
        http.csrf(csrf -> csrf.disable());

        // Protect endpoints at /api/secure
        http.authorizeRequests(configurer ->
        configurer
                .antMatchers(secureEndpoints).authenticated()
        );

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        // Add CORS filter
        http.cors(Customizer.withDefaults());

        // Add content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Force a non-empty response body for 401's to make the response friendly
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }
}
