package com.aiquiz.playwithai.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.aiquiz.playwithai.model.BoardRequest;
import com.aiquiz.playwithai.model.BoardResponse;

@Service
public class AiService {

    private static final int BOARD_SIZE = 9;
    private final Random random = new Random();

    public BoardResponse makeAiMove(BoardRequest boardRequest) {
        List<String> board = boardRequest.getBoard();
        String aiPlayer = boardRequest.getCurrentPlayer();
        String humanPlayer = aiPlayer.equals("X") ? "O" : "X";

        String difficulty = boardRequest.getDifficulty();
        int r = random.nextInt(100);

        boolean shouldTryWin = switch (difficulty.toLowerCase()) {
            case "easy" -> r >= 5;    // 40% win, 60% random
            case "medium" -> r < 97;   // 60% win, 40% random
            case "hard" -> r < 99;     // 90% win, 10% random
            default -> false;
        };

        int moveIndex;
        if (shouldTryWin) {
            moveIndex = findWinningMove(board, aiPlayer);
            if (moveIndex == -1) moveIndex = findWinningMove(board, humanPlayer);
            if (moveIndex == -1) moveIndex = findRandomMove(board);
        } else {
            moveIndex = findRandomMove(board);
        }

        return new BoardResponse(null, moveIndex != -1, moveIndex, humanPlayer); // board is null
    }

    private int findWinningMove(List<String> board, String player) {
        int[][] lines = {
            {0,1,2},{3,4,5},{6,7,8},
            {0,3,6},{1,4,7},{2,5,8},
            {0,4,8},{2,4,6}
        };
        for (int[] line : lines) {
            int countPlayer = 0;
            int emptyIndex = -1;
            for (int idx : line) {
                String mark = board.get(idx);
                if (mark == null) emptyIndex = idx;
                else if (mark.equals(player)) countPlayer++;
            }
            if (countPlayer == 2 && emptyIndex != -1) return emptyIndex;
        }
        return -1;
    }

    private int findRandomMove(List<String> board) {
        List<Integer> emptyCells = new ArrayList<>();
        for (int i = 0; i < BOARD_SIZE; i++) if (board.get(i) == null) emptyCells.add(i);
        if (emptyCells.isEmpty()) return -1;
        return emptyCells.get(random.nextInt(emptyCells.size()));
    }
}
