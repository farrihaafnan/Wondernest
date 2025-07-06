package com.wondernest.userlearning.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class RegisterRequestTest {

    private final Validator validator;

    public RegisterRequestTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testSettersAndGetters() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");
        assertEquals("test@example.com", req.getEmail());
        assertEquals("password123", req.getPassword());
    }

    @Test
    public void testValidation_invalidEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("invalid");
        req.setPassword("password123");
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(req);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    public void testValidation_shortPassword() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("123");
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(req);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    public void testValidation_blankFields() {
        RegisterRequest req = new RegisterRequest();
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(req);
        assertTrue(violations.size() >= 2); // Both fields required
    }

    @Test
    void shouldBeValid_whenEmailAndPasswordAreValid() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void shouldBeInvalid_whenEmailIsNull() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(null);
        request.setPassword("password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void shouldBeInvalid_whenEmailIsEmpty() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("");
        request.setPassword("password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void shouldBeInvalid_whenEmailIsInvalid() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("invalid-email");
        request.setPassword("password123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void shouldBeInvalid_whenPasswordIsNull() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword(null);

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void shouldBeInvalid_whenPasswordIsEmpty() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void shouldBeInvalid_whenPasswordIsTooShort() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void shouldBeValid_whenEmailIsValidFormat() {
        String[] validEmails = {
            "test@example.com",
            "user.name@domain.co.uk",
            "user+tag@example.org",
            "123@example.com"
        };

        for (String email : validEmails) {
            RegisterRequest request = new RegisterRequest();
            request.setEmail(email);
            request.setPassword("password123");

            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

            assertTrue(violations.isEmpty(), "Email " + email + " should be valid");
        }
    }
} 