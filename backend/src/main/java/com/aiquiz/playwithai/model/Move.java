package com.aiquiz.playwithai.model;

public class Move {

    private int index;      // Cell index (0-8)
    private String player;  // "X" or "O"

    public Move() {
    }

    public Move(int index, String player) {
        this.index = index;
        this.player = player;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }
}
