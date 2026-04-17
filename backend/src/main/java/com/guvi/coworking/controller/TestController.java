package com.guvi.coworking.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/member")
    @PreAuthorize("hasRole('MEMBER') or hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public String memberAccess() {
        return "Member Content.";
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public String managerAccess() {
        return "Space Manager Board.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }
}
