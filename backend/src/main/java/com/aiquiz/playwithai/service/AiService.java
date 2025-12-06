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
    private static final int MAX_DEPTH_HARD = 12;  // Maximum depth for unbeatable play
    private static final int MAX_DEPTH_MEDIUM = 8; // Depth for very difficult play
    private static final int WIN_SCORE = 1000;
    private static final int LOSE_SCORE = -1000;
    private final Random random = new Random();

    private static final int[][] WINNING_LINES = {
        {0,1,2},{3,4,5},{6,7,8},
        {0,3,6},{1,4,7},{2,5,8},
        {0,4,8},{2,4,6}
    };

    public BoardResponse makeAiMove(BoardRequest boardRequest) {
        List<String> board = new ArrayList<>(boardRequest.getBoard());
        String aiPlayer = boardRequest.getCurrentPlayer();
        String humanPlayer = aiPlayer.equals("X") ? "O" : "X";
        String difficulty = boardRequest.getDifficulty() != null ? boardRequest.getDifficulty().toLowerCase() : "medium";
        
        List<Integer> playerMoves = boardRequest.getPlayerMoves() != null ? new ArrayList<>(boardRequest.getPlayerMoves()) : new ArrayList<>();
        List<Integer> aiMoves = boardRequest.getAiMoves() != null ? new ArrayList<>(boardRequest.getAiMoves()) : new ArrayList<>();

        int moveIndex = -1;

        switch (difficulty) {
            case "hard":
                // Level 3: UNBEATABLE - Perfect Minimax with maximum depth
                // First check for immediate wins
                moveIndex = findImmediateWinningMove(board, aiMoves, playerMoves, aiPlayer, humanPlayer);
                if (moveIndex == -1) {
                    // Block opponent's winning move
                    moveIndex = findBlockingMove(board, playerMoves, aiMoves, humanPlayer, aiPlayer);
                }
                if (moveIndex == -1) {
                    // Use perfect Minimax
                    MoveResult result = minimax(board, aiMoves, playerMoves, aiPlayer, humanPlayer, MAX_DEPTH_HARD, true, Integer.MIN_VALUE, Integer.MAX_VALUE);
                    moveIndex = result.moveIndex;
                }
                break;
            case "medium":
                // Level 2: VERY DIFFICULT - Always use Minimax with high depth, prioritize winning/blocking
                // Always try to win first
                moveIndex = findImmediateWinningMove(board, aiMoves, playerMoves, aiPlayer, humanPlayer);
                if (moveIndex == -1) {
                    // Always block opponent wins
                    moveIndex = findBlockingMove(board, playerMoves, aiMoves, humanPlayer, aiPlayer);
                }
                if (moveIndex == -1) {
                    // Use Minimax with good depth
                    MoveResult result = minimax(board, aiMoves, playerMoves, aiPlayer, humanPlayer, MAX_DEPTH_MEDIUM, true, Integer.MIN_VALUE, Integer.MAX_VALUE);
                    moveIndex = result.moveIndex;
                }
                break;
            case "easy":
            default:
                // Level 1: Easy - Random or basic blocking
                moveIndex = findImmediateWinningMove(board, aiMoves, playerMoves, aiPlayer, humanPlayer);
                if (moveIndex == -1) {
                    moveIndex = findRandomMove(board);
                }
                break;
        }

        // Fallback to random if all else fails (shouldn't happen)
        if (moveIndex == -1 || moveIndex < 0 || moveIndex >= BOARD_SIZE) {
            moveIndex = findRandomMove(board);
        }

        return new BoardResponse(null, moveIndex != -1, moveIndex, humanPlayer);
    }

    /**
     * Minimax algorithm with alpha-beta pruning and vanishing mechanic awareness
     */
    private MoveResult minimax(List<String> board, List<Integer> currentPlayerMoves, List<Integer> opponentMoves,
                               String maximizingPlayer, String minimizingPlayer, int depth, boolean isMaximizing,
                               int alpha, int beta) {
        
        // Check for terminal states
        String winner = checkWinner(board);
        if (winner != null) {
            if (winner.equals(maximizingPlayer)) {
                return new MoveResult(WIN_SCORE + depth * 10, -1); // Prefer faster wins
            } else {
                return new MoveResult(LOSE_SCORE - depth * 10, -1); // Prefer slower losses
            }
        }

        List<Integer> availableMoves = getAvailableMoves(board);
        if (availableMoves.isEmpty() || depth == 0) {
            // Evaluate position heuristically
            int score = evaluatePosition(board, maximizingPlayer, minimizingPlayer);
            return new MoveResult(score, availableMoves.isEmpty() ? -1 : availableMoves.get(0));
        }

        if (isMaximizing) {
            int bestScore = Integer.MIN_VALUE;
            int bestMove = availableMoves.get(0);

            for (int move : availableMoves) {
                // Simulate move
                List<String> newBoard = new ArrayList<>(board);
                List<Integer> newPlayerMoves = new ArrayList<>(currentPlayerMoves);
                
                // Apply move with vanishing mechanic
                applyMoveWithVanishing(newBoard, newPlayerMoves, move, maximizingPlayer);
                
                // Recursive call - swap moves since it's now minimizing player's turn
                MoveResult result = minimax(newBoard, opponentMoves, newPlayerMoves, 
                                           maximizingPlayer, minimizingPlayer, depth - 1, false, alpha, beta);
                
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                
                // Alpha-beta pruning
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) {
                    break; // Beta cut-off
                }
            }
            return new MoveResult(bestScore, bestMove);
        } else {
            int bestScore = Integer.MAX_VALUE;
            int bestMove = availableMoves.get(0);

            for (int move : availableMoves) {
                // Simulate move
                List<String> newBoard = new ArrayList<>(board);
                List<Integer> newOpponentMoves = new ArrayList<>(opponentMoves);
                
                // Apply move with vanishing mechanic
                applyMoveWithVanishing(newBoard, newOpponentMoves, move, minimizingPlayer);
                
                // Recursive call - swap moves since it's now maximizing player's turn
                MoveResult result = minimax(newBoard, currentPlayerMoves, newOpponentMoves, 
                                           maximizingPlayer, minimizingPlayer, depth - 1, true, alpha, beta);
                
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                
                // Alpha-beta pruning
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) {
                    break; // Alpha cut-off
                }
            }
            return new MoveResult(bestScore, bestMove);
        }
    }

    /**
     * Evaluate position heuristically when depth limit is reached
     */
    private int evaluatePosition(List<String> board, String maximizingPlayer, String minimizingPlayer) {
        int score = 0;
        
        // Check each winning line
        for (int[] line : WINNING_LINES) {
            int maxCount = 0;
            int minCount = 0;
            
            for (int idx : line) {
                String cell = board.get(idx);
                if (cell != null) {
                    if (cell.equals(maximizingPlayer)) {
                        maxCount++;
                    } else if (cell.equals(minimizingPlayer)) {
                        minCount++;
                    }
                }
            }
            
            // Reward positions where maximizing player has advantage
            if (maxCount > 0 && minCount == 0) {
                score += maxCount * maxCount * 10; // Exponential bonus for multiple pieces
            }
            // Penalize positions where minimizing player has advantage
            if (minCount > 0 && maxCount == 0) {
                score -= minCount * minCount * 10;
            }
        }
        
        return score;
    }

    /**
     * Apply a move with the vanishing mechanic: if player has 4+ moves, remove oldest
     */
    private void applyMoveWithVanishing(List<String> board, List<Integer> moves, int moveIndex, String player) {
        // Place the new mark
        board.set(moveIndex, player);
        
        // Check for win before adding to moves list
        String winner = checkWinner(board);
        
        // Add the move to the history
        moves.add(moveIndex);
        
        // If there's no winner and we have more than 3 moves, remove the oldest
        if (winner == null && moves.size() > 3) {
            int oldestMove = moves.remove(0);
            board.set(oldestMove, null);
        }
    }

    /**
     * Check for a winner on the board
     */
    private String checkWinner(List<String> board) {
        for (int[] line : WINNING_LINES) {
            String first = board.get(line[0]);
            if (first != null && 
                first.equals(board.get(line[1])) && 
                first.equals(board.get(line[2]))) {
                return first;
            }
        }
        return null;
    }

    /**
     * Find immediate winning move (considering vanishing mechanic)
     * Also checks for threats that can be blocked
     */
    private int findImmediateWinningMove(List<String> board, List<Integer> currentMoves, 
                                        List<Integer> opponentMoves, String player, String opponent) {
        List<Integer> availableMoves = getAvailableMoves(board);
        
        // First, check for immediate wins
        for (int move : availableMoves) {
            List<String> testBoard = new ArrayList<>(board);
            List<Integer> testMoves = new ArrayList<>(currentMoves);
            
            applyMoveWithVanishing(testBoard, testMoves, move, player);
            
            String winner = checkWinner(testBoard);
            if (winner != null && winner.equals(player)) {
                return move;
            }
        }
        
        // Check for creating double threats (two ways to win)
        for (int move : availableMoves) {
            List<String> testBoard = new ArrayList<>(board);
            List<Integer> testMoves = new ArrayList<>(currentMoves);
            applyMoveWithVanishing(testBoard, testMoves, move, player);
            
            int threats = countWinningThreats(testBoard, player);
            if (threats >= 2) {
                return move; // Creating multiple threats
            }
        }
        
        return -1;
    }

    /**
     * Find a move that blocks the opponent from winning (considering vanishing mechanic)
     */
    private int findBlockingMove(List<String> board, List<Integer> opponentMoves, List<Integer> myMoves,
                                 String opponent, String me) {
        List<Integer> availableMoves = getAvailableMoves(board);
        
        // Check if opponent can win on their next move
        for (int move : availableMoves) {
            List<String> testBoard = new ArrayList<>(board);
            List<Integer> testOpponentMoves = new ArrayList<>(opponentMoves);
            
            // Simulate opponent making this move
            applyMoveWithVanishing(testBoard, testOpponentMoves, move, opponent);
            
            // Check if this move results in opponent winning
            String winner = checkWinner(testBoard);
            if (winner != null && winner.equals(opponent)) {
                // Block this move!
                return move;
            }
        }
        
        // Also check for double threats that need blocking
        for (int move : availableMoves) {
            List<String> testBoard = new ArrayList<>(board);
            List<Integer> testOpponentMoves = new ArrayList<>(opponentMoves);
            applyMoveWithVanishing(testBoard, testOpponentMoves, move, opponent);
            
            int threats = countWinningThreats(testBoard, opponent);
            if (threats >= 2) {
                // Block this move to prevent multiple threats
                return move;
            }
        }
        
        return -1;
    }

    /**
     * Count how many ways a player can win in their next move
     */
    private int countWinningThreats(List<String> board, String player) {
        int threatCount = 0;
        List<Integer> availableMoves = getAvailableMoves(board);
        
        for (int move : availableMoves) {
            List<String> testBoard = new ArrayList<>(board);
            testBoard.set(move, player);
            
            if (checkWinner(testBoard) != null && checkWinner(testBoard).equals(player)) {
                threatCount++;
            }
        }
        
        return threatCount;
    }

    /**
     * Get all available moves (empty cells)
     */
    private List<Integer> getAvailableMoves(List<String> board) {
        List<Integer> moves = new ArrayList<>();
        for (int i = 0; i < BOARD_SIZE; i++) {
            if (board.get(i) == null) {
                moves.add(i);
            }
        }
        return moves;
    }

    /**
     * Find a random available move
     */
    private int findRandomMove(List<String> board) {
        List<Integer> emptyCells = getAvailableMoves(board);
        if (emptyCells.isEmpty()) return -1;
        return emptyCells.get(random.nextInt(emptyCells.size()));
    }

    /**
     * Helper class to store minimax results
     */
    private static class MoveResult {
        int score;
        int moveIndex;

        MoveResult(int score, int moveIndex) {
            this.score = score;
            this.moveIndex = moveIndex;
        }
    }
}