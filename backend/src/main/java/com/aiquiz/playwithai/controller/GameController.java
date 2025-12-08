package com.aiquiz.playwithai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiquiz.playwithai.model.BoardRequest;
import com.aiquiz.playwithai.model.BoardResponse;
import com.aiquiz.playwithai.service.AiService;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = {"https://endless-tic-tac-toe-puce.vercel.app", "http://localhost:3000"}) // allow requests from deployed frontend and local dev
public class GameController {

    private final AiService aiService;

    @Autowired
    public GameController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * Endpoint to get AI move.
     * Frontend sends current board, level, and difficulty.
     * Backend returns updated board and AI move.
     */
    @PostMapping("/aiMove")
    public BoardResponse getAiMove(@RequestBody BoardRequest boardRequest) {
        // AiService handles AI move logic based on difficulty
        
        return aiService.makeAiMove(boardRequest);
    }
    
    /**
     * Health check endpoint to warm up the service.
     * Render free tier goes to sleep after inactivity, this wakes it up.
     */
    @GetMapping("/ready")
    public java.util.Map<String, Object> checkReady() {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", "ready");
        response.put("message", "AI is ready to play!");
        response.put("timestamp", java.time.Instant.now().toString());
        return response;
    }
}
