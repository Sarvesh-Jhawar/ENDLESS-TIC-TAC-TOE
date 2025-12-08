package com.aiquiz.playwithai.controller;

import com.aiquiz.playwithai.dto.LeaderboardResponse;
import com.aiquiz.playwithai.model.LeaderboardEntry;
import com.aiquiz.playwithai.repository.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = {"https://endless-tic-tac-toe-puce.vercel.app", "http://localhost:3000"})
public class LeaderboardController {

    @Autowired
    private LeaderboardRepository repository;

    @PostMapping("/add")
    public LeaderboardResponse addEntry(@RequestBody LeaderboardEntry entry) {
        // Check if entry with same phone number and email already exists
        Optional<LeaderboardEntry> existingEntry = repository.findByPhoneNumberAndEmail(
            entry.getPhoneNumber(), 
            entry.getEmail()
        );
        
        if (existingEntry.isPresent()) {
            LeaderboardEntry existing = existingEntry.get();
            
            // Always update the name
            existing.setName(entry.getName());
            existing.setDatePlayed(LocalDateTime.now());
            
            // Check if new time is better (lower)
            boolean timeUpdated = entry.getTimeTakenMs() < existing.getTimeTakenMs();
            
            if (timeUpdated) {
                existing.setTimeTakenMs(entry.getTimeTakenMs());
            }
            
            LeaderboardEntry savedEntry = repository.save(existing);
            
            String message = timeUpdated 
                ? "Welcome back! Your new best time has been recorded!" 
                : "Welcome back! Your previous best time is still better (" + formatTime(existing.getTimeTakenMs()) + ")";
            
            return new LeaderboardResponse(savedEntry, false, timeUpdated, message);
        } else {
            // New entry - just save it
            entry.setDatePlayed(LocalDateTime.now());
            LeaderboardEntry savedEntry = repository.save(entry);
            
            return new LeaderboardResponse(savedEntry, true, true, "Congratulations! You've been added to the leaderboard!");
        }
    }
    
    // Helper method to format time as mm:ss.ms
    private String formatTime(long ms) {
        long minutes = ms / 60000;
        long seconds = (ms % 60000) / 1000;
        long millis = ms % 1000;
        return String.format("%02d:%02d.%03d", minutes, seconds, millis);
    }

    @GetMapping("/top")
    public List<LeaderboardEntry> getTopScores() {
        return repository.findTop10ByOrderByTimeTakenMsAsc();
    }
    
    @GetMapping("/all")
    public List<LeaderboardEntry> getAllScores() {
        return repository.findAllByOrderByTimeTakenMsAsc();
    }
}