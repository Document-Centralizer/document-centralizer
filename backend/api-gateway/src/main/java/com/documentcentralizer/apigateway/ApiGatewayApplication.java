package com.documentcentralizer.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This annotation marks this class as a Spring Boot application
// It automatically configures the application based on the added dependencies
@SpringBootApplication
public class ApiGatewayApplication {

    // The main method is the entry point for the Java application
    // It uses SpringApplication.run() to start the API Gateway server
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.java, args);
    }
}
