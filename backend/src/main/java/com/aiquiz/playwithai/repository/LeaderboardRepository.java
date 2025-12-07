package com.aiquiz.playwithai.repository;

import com.aiquiz.playwithai.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    // Get top 10 players who finished fastest (lowest time in milliseconds)
    List<LeaderboardEntry> findTop10ByOrderByTimeTakenMsAsc();
    
    // Get all players sorted by time (for full leaderboard)
    List<LeaderboardEntry> findAllByOrderByTimeTakenMsAsc();
    
    // Find existing entry by phone number and email
    Optional<LeaderboardEntry> findByPhoneNumberAndEmail(String phoneNumber, String email);
}
