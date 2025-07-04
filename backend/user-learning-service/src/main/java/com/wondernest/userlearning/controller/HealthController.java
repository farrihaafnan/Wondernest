// package com.wondernest.userlearning.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api")
// public class HealthController {

//     @GetMapping("/health")
//     public ResponseEntity<Map<String, Object>> healthCheck() {
//         Map<String, Object> response = new HashMap<>();
//         response.put("status", "healthy");
//         response.put("service", "WonderNest User Learning Service");
//         response.put("timestamp", System.currentTimeMillis());
//         return ResponseEntity.ok(response);
//     }
// } 
package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private ParentRepository parentRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "WonderNest User Learning Service");
        response.put("timestamp", System.currentTimeMillis());

        try {
            long parentCount = parentRepository.count();  // simple DB check
            response.put("dbConnected", true);
            response.put("parentCount", parentCount);
        } catch (Exception e) {
            response.put("dbConnected", false);
            response.put("dbError", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }
}

