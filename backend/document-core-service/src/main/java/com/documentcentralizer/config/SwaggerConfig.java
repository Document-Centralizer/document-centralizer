package com.documentcentralizer.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 * Class Name: SwaggerConfig
 *
 * Purpose:
 * Configures the OpenAPI (Swagger 3) documentation for the Document Centralizer application.
 *
 * Responsibility:
 * - Define API title, version, description, contact, and license info.
 * - Configure the JWT Bearer Token security scheme so that secured endpoints
 *   can be tested directly from the Swagger UI using the Authorize button.
 *
 * Author:
 * CDAC Project
 */
@Configuration
public class SwaggerConfig {

    /*
     * Method: customOpenAPI()
     * Purpose: Creates and customizes the OpenAPI Bean.
     * Input: None
     * Output: OpenAPI configuration object used by springdoc-openapi.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Document Centralizer API")
                        .description("REST APIs for Document Centralizer System")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Document Centralizer Team")
                                .email("support@documentcentralizer.com"))
                        .license(new License()
                                .name("MIT")))
                // Add security requirement globally or just provide the scheme
                // If added globally, all endpoints require it unless overridden.
                // We will add it globally and then override if needed, or we just configure the scheme 
                // and explicitly add @SecurityRequirement to secured controllers.
                // The prompt asks to allow testing secured APIs, we'll provide the scheme here.
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
