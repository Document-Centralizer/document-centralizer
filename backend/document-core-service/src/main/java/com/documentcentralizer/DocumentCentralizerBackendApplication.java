package com.documentcentralizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DocumentCentralizerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocumentCentralizerBackendApplication.class, args);
	}

}
