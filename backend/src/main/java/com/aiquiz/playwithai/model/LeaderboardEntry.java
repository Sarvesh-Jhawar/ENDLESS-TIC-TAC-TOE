package com.aiquiz.playwithai.model;



import java.time.LocalDateTime;

import jakarta.persistence.*;

import jakarta.persistence.Entity;

@Entity
@Table(name = "leaderboard")
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phoneNumber;
    private String email;
    
    // Store time in milliseconds (using existing column, renamed for clarity)
    @Column(name = "time_taken_seconds")
    private long timeTakenMs;
    
    private LocalDateTime datePlayed;

    public LeaderboardEntry() {}

    public LeaderboardEntry(String name, String phoneNumber, String email, long timeTakenMs) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.timeTakenMs = timeTakenMs;
        this.datePlayed = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public long getTimeTakenMs() { return timeTakenMs; }
    public void setTimeTakenMs(long timeTakenMs) { this.timeTakenMs = timeTakenMs; }
    
    public LocalDateTime getDatePlayed() { return datePlayed; }
    public void setDatePlayed(LocalDateTime datePlayed) { this.datePlayed = datePlayed; }
}