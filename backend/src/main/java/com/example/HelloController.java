package com.example;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public Message hello() {
        return new Message("Ciao dal backend! Questo è un microservizio Java.");
    }

    public static class Message {
        private final String text;

        public Message(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }
    }
}
