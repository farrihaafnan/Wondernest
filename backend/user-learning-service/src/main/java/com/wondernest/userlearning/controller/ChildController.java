package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.ChildDto;
import com.wondernest.userlearning.dto.ChildRequest;
import com.wondernest.userlearning.model.Child;
import com.wondernest.userlearning.model.Parent;
import com.wondernest.userlearning.repository.ChildRepository;
import com.wondernest.userlearning.repository.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChildController {

    @Autowired
    private ChildRepository childRepository;

    @Autowired
    private ParentRepository parentRepository;

    @PostMapping("/children")
    public ResponseEntity<?> createChild(@RequestBody ChildRequest request) {
        Optional<Parent> parentOpt = parentRepository.findById(UUID.fromString(request.getParentId()));
        if (parentOpt.isEmpty()) return ResponseEntity.badRequest().body("Parent not found");

        Child child = new Child();
        child.setName(request.getName());
        child.setAge(request.getAge());
        child.setGender(request.getGender());
        child.setAvatarUrl(request.getAvatarUrl());
        child.setParent(parentOpt.get());

        return ResponseEntity.ok(childRepository.save(child));
    }

    @GetMapping("/parents/{parentId}/children")
    public ResponseEntity<List<ChildDto>> getChildrenByParent(@PathVariable UUID parentId) {
        List<Child> children = childRepository.findByParentId(parentId);
        List<ChildDto> childDtos = children.stream()
                .map(ChildDto::new)
                .toList();
        return ResponseEntity.ok(childDtos);
    }
}
