package com.aiquiz.playwithai.model;

import java.util.List;

public class BoardRequest {
    private List<String> board; // 9 elements: "X", "O", or null
    private String currentPlayer; // "X" or "O"
    private String difficulty; // easy, medium, hard
    private List<Integer> playerMoves; // History of player moves (for vanishing mechanic)
    private List<Integer> aiMoves; // History of AI moves (for vanishing mechanic)

    public BoardRequest() {
    }

    public BoardRequest(List<String> board, String currentPlayer, String difficulty) {
        this.board = board;
        this.currentPlayer = currentPlayer;
        this.difficulty = difficulty;
    }

    public BoardRequest(List<String> board, String currentPlayer, String difficulty, List<Integer> playerMoves, List<Integer> aiMoves) {
        this.board = board;
        this.currentPlayer = currentPlayer;
        this.difficulty = difficulty;
        this.playerMoves = playerMoves;
        this.aiMoves = aiMoves;
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

    public List<Integer> getPlayerMoves() {
        return playerMoves;
    }

    public void setPlayerMoves(List<Integer> playerMoves) {
        this.playerMoves = playerMoves;
    }

    public List<Integer> getAiMoves() {
        return aiMoves;
    }

    public void setAiMoves(List<Integer> aiMoves) {
        this.aiMoves = aiMoves;
    }
}
