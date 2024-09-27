package com.web.stard.domain.admin.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/health")
    public String healthCheck() {
        return "I'm healthy!";
    }
}
