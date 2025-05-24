// package com.wondernest.userlearning.service;

// import com.wondernest.userlearning.dto.RegisterRequest;
// import com.wondernest.userlearning.model.Parent;
// import com.wondernest.userlearning.repository.ParentRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// @Service
// public class AuthService {
    
//     @Autowired
//     private ParentRepository parentRepository;
    
//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @Transactional
//     public Parent register(RegisterRequest request) {
//         if (parentRepository.existsByEmail(request.getEmail())) {
//             throw new RuntimeException("Email already registered");
//         }

//         Parent parent = new Parent();
//         parent.setEmail(request.getEmail());
//         parent.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
//         System.out.println("This is a debug message");
        
//         return parentRepository.save(parent);
//     }
// } 

package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.LoginRequest;
import com.wondernest.userlearning.dto.RegisterRequest;
import com.wondernest.userlearning.model.Parent;
import com.wondernest.userlearning.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Parent register(RegisterRequest request) {
        if (parentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Parent parent = new Parent();
        parent.setEmail(request.getEmail());
        parent.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        System.out.println("This is a debug message");

        return parentRepository.save(parent);
    }

    public Parent login(LoginRequest request) {
        Parent parent = parentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), parent.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return parent;
    }
}
