package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.RegisterRequest;
import com.wondernest.userlearning.dto.LoginRequest;
import com.wondernest.userlearning.model.Parent;
import com.wondernest.userlearning.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Request received:");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + request.getPassword());
        try {
            Parent parent = authService.register(request);
            return ResponseEntity.ok(parent);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Call the AuthService login method (we'll check this next)
            var response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

