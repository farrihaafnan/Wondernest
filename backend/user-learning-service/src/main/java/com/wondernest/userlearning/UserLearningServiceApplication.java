package com.wondernest.userlearning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UserLearningServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserLearningServiceApplication.class, args);
    }
} 

