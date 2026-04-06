package com.example;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notify")
public class NotificationController {

    private final EchoWebSocketHandler echoWebSocketHandler;

    public NotificationController(EchoWebSocketHandler echoWebSocketHandler) {
        this.echoWebSocketHandler = echoWebSocketHandler;
    }

    @PostMapping
    public ResponseEntity<?> notifyAllClients(@RequestBody NotificationDto dto) {
        if (dto == null || dto.getTitle() == null || dto.getBody() == null) {
            return ResponseEntity.badRequest().body("title and body are required");
        }

        int clients = echoWebSocketHandler.broadcastNotification(dto.getTitle(), dto.getBody());
        String message = "Notifica inviata a " + clients + " client WebSocket connessi";
        System.out.println("[HTTP Notify] " + message);

        if (clients == 0) {
            return ResponseEntity.status(503).body("Nessun client WebSocket connesso");
        }
        return ResponseEntity.ok(message);
    }

    public static class NotificationDto {
        private String title;
        private String body;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }
    }
}
