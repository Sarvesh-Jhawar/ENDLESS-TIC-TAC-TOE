package com.aiquiz.playwithai.model;


import java.util.List;

public class BoardResponse {
    private List<String> board;  // Updated board after AI move
    private boolean moveMade;    // Whether AI made a move
    private int moveIndex;       // Index where AI placed its mark
    private String nextPlayer;   // Next player to move (frontend uses this)

    public BoardResponse() {
    }

    public BoardResponse(List<String> board, boolean moveMade, int moveIndex, String nextPlayer) {
        this.board = board;
        this.moveMade = moveMade;
        this.moveIndex = moveIndex;
        this.nextPlayer = nextPlayer;
    }

    public List<String> getBoard() {
        return board;
    }

    public void setBoard(List<String> board) {
        this.board = board;
    }

    public boolean isMoveMade() {
        return moveMade;
    }

    public void setMoveMade(boolean moveMade) {
        this.moveMade = moveMade;
    }

    public int getMoveIndex() {
        return moveIndex;
    }

    public void setMoveIndex(int moveIndex) {
        this.moveIndex = moveIndex;
    }

    public String getNextPlayer() {
        return nextPlayer;
    }

    public void setNextPlayer(String nextPlayer) {
        this.nextPlayer = nextPlayer;
    }
}
