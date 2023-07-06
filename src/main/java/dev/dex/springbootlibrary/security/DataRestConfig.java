package dev.dex.springbootlibrary.security;

import dev.dex.springbootlibrary.entity.*;
import org.springframework.context.annotation.*;
import org.springframework.data.rest.core.config.*;
import org.springframework.data.rest.webmvc.config.*;
import org.springframework.http.*;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    private String[] theAllowedOrigins = {"https://localhost:3000", "http://localhost:3001"};

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH };

        config.exposeIdsFor(Book.class);
        disableHttpMethods(Book.class, config, theUnsupportedActions);

        config.exposeIdsFor(Review.class);
        disableHttpMethods(Review.class, config, theUnsupportedActions);

        config.exposeIdsFor(History.class);
        disableHttpMethods(History.class, config, theUnsupportedActions);

        config.exposeIdsFor(Message.class);
        disableHttpMethods(Message.class, config, theUnsupportedActions);

        /* Configure CORS Mapping */
        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOrigins);

        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
    }

    private void disableHttpMethods(Class clazz, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(clazz)
                .withItemExposure((metadata, httpMethods) ->
                        httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metadata, httpMethods) ->
                        httpMethods.disable(unsupportedActions));
    }
}
