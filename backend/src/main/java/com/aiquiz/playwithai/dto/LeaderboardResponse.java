package com.aiquiz.playwithai.dto;

import com.aiquiz.playwithai.model.LeaderboardEntry;

public class LeaderboardResponse {
    private LeaderboardEntry entry;
    private boolean isNewEntry;
    private boolean timeUpdated;
    private String message;

    public LeaderboardResponse(LeaderboardEntry entry, boolean isNewEntry, boolean timeUpdated, String message) {
        this.entry = entry;
        this.isNewEntry = isNewEntry;
        this.timeUpdated = timeUpdated;
        this.message = message;
    }

    // Getters and Setters
    public LeaderboardEntry getEntry() { return entry; }
    public void setEntry(LeaderboardEntry entry) { this.entry = entry; }
    
    public boolean isNewEntry() { return isNewEntry; }
    public void setNewEntry(boolean newEntry) { isNewEntry = newEntry; }
    
    public boolean isTimeUpdated() { return timeUpdated; }
    public void setTimeUpdated(boolean timeUpdated) { this.timeUpdated = timeUpdated; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
