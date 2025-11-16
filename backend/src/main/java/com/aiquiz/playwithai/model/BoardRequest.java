package com.aiquiz.playwithai.model;

import java.util.List;

public class BoardRequest {
    private List<String> board; // 9 elements: "X", "O", or null
    private String currentPlayer; // "X" or "O"
    private String difficulty; // easy, medium, hard

    public BoardRequest() {
    }

    public BoardRequest(List<String> board, String currentPlayer, String difficulty) {
        this.board = board;
        this.currentPlayer = currentPlayer;
        this.difficulty = difficulty;
    }

    public List<String> getBoard() {
        return board;
    }

    public void setBoard(List<String> board) {
        this.board = board;
    }

    public String getCurrentPlayer() {
        return currentPlayer;
    }

    public void setCurrentPlayer(String currentPlayer) {
        this.currentPlayer = currentPlayer;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}
