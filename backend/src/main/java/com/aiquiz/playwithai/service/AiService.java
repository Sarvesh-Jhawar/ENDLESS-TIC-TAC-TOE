package com.aiquiz.playwithai.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.aiquiz.playwithai.model.BoardRequest;
import com.aiquiz.playwithai.model.BoardResponse;

@Service
public class AiService {

    private static final int BOARD_SIZE = 9;
    private static final int MAX_DEPTH = 35;
    private static final int WIN_SCORE = 10000000;
    private static final int LOSE_SCORE = -10000000;
    private final Random random = new Random();

    private static final int[][] WINNING_LINES = {
        {0,1,2}, {3,4,5}, {6,7,8},
        {0,3,6}, {1,4,7}, {2,5,8},
        {0,4,8}, {2,4,6}
    };

    private final Map<String, TranspositionEntry> transpositionTable = new HashMap<>();

    public BoardResponse makeAiMove(BoardRequest boardRequest) {
        List<String> board = new ArrayList<>(boardRequest.getBoard());
        String aiPlayer = boardRequest.getCurrentPlayer();
        String humanPlayer = aiPlayer.equals("X") ? "O" : "X";
        
        List<Integer> playerMoves = boardRequest.getPlayerMoves() != null ? 
            new ArrayList<>(boardRequest.getPlayerMoves()) : new ArrayList<>();
        List<Integer> aiMoves = boardRequest.getAiMoves() != null ? 
            new ArrayList<>(boardRequest.getAiMoves()) : new ArrayList<>();

        transpositionTable.clear();
        
        // Pure minimax - AI plays to WIN, not just defend
        MoveResult result = perfectMinimax(
            board, aiMoves, playerMoves, aiPlayer, humanPlayer, 
            MAX_DEPTH, true, Integer.MIN_VALUE, Integer.MAX_VALUE
        );
        
        int moveIndex = result.moveIndex;

        if (moveIndex == -1 || moveIndex < 0 || moveIndex >= BOARD_SIZE) {
            moveIndex = findBestOffensiveMove(board, aiMoves, playerMoves, aiPlayer, humanPlayer);
        }

        return new BoardResponse(null, moveIndex != -1, moveIndex, humanPlayer);
    }

    /**
     * PERFECT MINIMAX: AI assumes opponent plays perfectly
     * This naturally handles both offense and defense optimally
     */
    private MoveResult perfectMinimax(
            List<String> board, 
            List<Integer> aiMoves, 
            List<Integer> playerMoves,
            String aiPlayer, 
            String humanPlayer, 
            int depth, 
            boolean isAiTurn,
            int alpha, 
            int beta) {
        
        String stateHash = generateHash(board, aiMoves, playerMoves, isAiTurn);
        
        TranspositionEntry cached = transpositionTable.get(stateHash);
        if (cached != null && cached.depth >= depth) {
            return new MoveResult(cached.score, cached.bestMove);
        }

        // Terminal state check
        String winner = checkWinner(board);
        if (winner != null) {
            int score = winner.equals(aiPlayer) ? 
                (WIN_SCORE - depth * 100) : (LOSE_SCORE + depth * 100);
            transpositionTable.put(stateHash, new TranspositionEntry(score, -1, depth));
            return new MoveResult(score, -1);
        }

        List<Integer> moves = getAvailableMoves(board);
        if (moves.isEmpty() || depth == 0) {
            int score = evaluatePositionPerfectly(
                board, aiMoves, playerMoves, aiPlayer, humanPlayer
            );
            transpositionTable.put(stateHash, new TranspositionEntry(score, -1, depth));
            return new MoveResult(score, -1);
        }

        // Order moves by potential
        moves = rankMovesByPotential(moves, board, 
            isAiTurn ? aiMoves : playerMoves,
            isAiTurn ? playerMoves : aiMoves,
            isAiTurn ? aiPlayer : humanPlayer
        );

        if (isAiTurn) {
            // AI's turn: Maximize
            int bestScore = Integer.MIN_VALUE;
            int bestMove = moves.get(0);

            for (int move : moves) {
                GameState state = executeMove(board, aiMoves, playerMoves, move, aiPlayer);
                
                MoveResult result = perfectMinimax(
                    state.board, state.aiMoves, state.playerMoves,
                    aiPlayer, humanPlayer, depth - 1, false, alpha, beta
                );
                
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; // Prune
            }
            
            transpositionTable.put(stateHash, new TranspositionEntry(bestScore, bestMove, depth));
            return new MoveResult(bestScore, bestMove);
            
        } else {
            // Human's turn: Minimize (AI assumes human plays perfectly)
            int bestScore = Integer.MAX_VALUE;
            int bestMove = moves.get(0);

            for (int move : moves) {
                GameState state = executeMove(board, playerMoves, aiMoves, move, humanPlayer);
                
                MoveResult result = perfectMinimax(
                    state.board, state.aiMoves, state.playerMoves,
                    aiPlayer, humanPlayer, depth - 1, true, alpha, beta
                );
                
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; // Prune
            }
            
            transpositionTable.put(stateHash, new TranspositionEntry(bestScore, bestMove, depth));
            return new MoveResult(bestScore, bestMove);
        }
    }

    /**
     * PERFECT EVALUATION: Only stable positions matter
     */
    private int evaluatePositionPerfectly(
            List<String> board,
            List<Integer> aiMoves,
            List<Integer> playerMoves,
            String aiPlayer,
            String humanPlayer) {
        
        int score = 0;
        
        // Identify what will vanish next
        Integer aiVanishing = aiMoves.size() == 3 ? aiMoves.get(0) : null;
        Integer playerVanishing = playerMoves.size() == 3 ? playerMoves.get(0) : null;
        
        // Evaluate each winning line
        for (int[] line : WINNING_LINES) {
            ThreatInfo aiThreat = analyzeLineThreat(board, line, aiPlayer, aiMoves);
            ThreatInfo playerThreat = analyzeLineThreat(board, line, humanPlayer, playerMoves);
            
            // AI THREATS - Only value STABLE threats
            if (aiThreat.pieces > 0 && playerThreat.pieces == 0) {
                if (aiThreat.pieces == 2) {
                    // Critical: 2 in a row
                    if (aiThreat.willVanish) {
                        score += 50; // Worthless threat
                    } else {
                        score += 50000; // WINNING POSITION!
                    }
                } else if (aiThreat.pieces == 1) {
                    score += aiThreat.willVanish ? 5 : 500;
                }
            }
            
            // OPPONENT THREATS - Value based on stability
            if (playerThreat.pieces > 0 && aiThreat.pieces == 0) {
                if (playerThreat.pieces == 2) {
                    if (playerThreat.willVanish) {
                        score -= 500; // Will self-destruct
                    } else {
                        score -= 60000; // MUST PREVENT!
                    }
                } else if (playerThreat.pieces == 1) {
                    score -= playerThreat.willVanish ? 5 : 500;
                }
            }
        }
        
        // Strategic position control (only if stable)
        if (aiVanishing == null || aiMoves.size() < 3) {
            // Center control
            if (board.get(4) != null && board.get(4).equals(aiPlayer)) {
                boolean stable = aiVanishing == null || aiVanishing != 4;
                score += stable ? 1000 : 50;
            }
            
            // Corner control
            int[] corners = {0, 2, 6, 8};
            for (int corner : corners) {
                if (board.get(corner) != null && board.get(corner).equals(aiPlayer)) {
                    boolean stable = aiVanishing == null || aiVanishing != corner;
                    score += stable ? 600 : 30;
                }
            }
        }
        
        // Penalize having vanishing piece in multiple strong lines
        if (aiVanishing != null) {
            int criticalLines = 0;
            for (int[] line : WINNING_LINES) {
                int aiCount = 0;
                boolean hasVanishing = false;
                for (int pos : line) {
                    if (board.get(pos) != null && board.get(pos).equals(aiPlayer)) {
                        aiCount++;
                        if (pos == aiVanishing) hasVanishing = true;
                    }
                }
                if (aiCount >= 2 && hasVanishing) criticalLines++;
            }
            score -= criticalLines * 10000; // Massive penalty
        }
        
        // Bonus for creating multiple threats
        int aiThreats = countStableThreats(board, aiMoves, aiPlayer);
        int playerThreats = countStableThreats(board, playerMoves, humanPlayer);
        
        score += aiThreats * 5000;
        score -= playerThreats * 5000;
        
        return score;
    }

    /**
     * Count stable 2-in-a-row threats
     */
    private int countStableThreats(List<String> board, List<Integer> moves, String player) {
        int threats = 0;
        Integer vanishing = moves.size() == 3 ? moves.get(0) : null;
        
        for (int[] line : WINNING_LINES) {
            int count = 0;
            boolean hasVanishing = false;
            int empty = 0;
            
            for (int pos : line) {
                if (board.get(pos) == null) {
                    empty++;
                } else if (board.get(pos).equals(player)) {
                    count++;
                    if (vanishing != null && pos == vanishing) {
                        hasVanishing = true;
                    }
                }
            }
            
            // Only count if 2 pieces + 1 empty + no vanishing piece
            if (count == 2 && empty == 1 && !hasVanishing) {
                threats++;
            }
        }
        
        return threats;
    }

    /**
     * Analyze line for threat level
     */
    private ThreatInfo analyzeLineThreat(List<String> board, int[] line, 
                                         String player, List<Integer> moves) {
        int pieces = 0;
        boolean willVanish = false;
        Integer vanishingPos = moves.size() == 3 ? moves.get(0) : null;
        
        for (int pos : line) {
            if (board.get(pos) != null && board.get(pos).equals(player)) {
                pieces++;
                if (vanishingPos != null && pos == vanishingPos) {
                    willVanish = true;
                }
            }
        }
        
        return new ThreatInfo(pieces, willVanish);
    }

    /**
     * Rank moves by winning potential
     */
    private List<Integer> rankMovesByPotential(
            List<Integer> moves, List<String> board,
            List<Integer> myMoves, List<Integer> oppMoves,
            String player) {
        
        List<MoveScore> scored = new ArrayList<>();
        
        for (int move : moves) {
            int score = 0;
            
            // Simulate move
            GameState state = executeMove(board, myMoves, oppMoves, move, player);
            
            // IMMEDIATE WIN = Top priority
            if (checkWinner(state.board) != null) {
                score += 10000000;
            }
            
            // Count stable threats created
            int threatsCreated = countStableThreats(state.board, state.currentMoves, player);
            score += threatsCreated * 100000;
            
            // Check if creates 2-in-a-row
            for (int[] line : WINNING_LINES) {
                ThreatInfo threat = analyzeLineThreat(state.board, line, player, state.currentMoves);
                if (threat.pieces == 2 && !threat.willVanish) {
                    score += 50000;
                } else if (threat.pieces == 2 && threat.willVanish) {
                    score += 100;
                }
            }
            
            // Position value
            if (move == 4) score += 2000; // Center
            if (move == 0 || move == 2 || move == 6 || move == 8) score += 1000; // Corners
            
            scored.add(new MoveScore(move, score));
        }
        
        scored.sort((a, b) -> Integer.compare(b.score, a.score));
        
        List<Integer> result = new ArrayList<>();
        for (MoveScore ms : scored) {
            result.add(ms.move);
        }
        return result;
    }

    /**
     * Execute move with perfect vanishing logic
     */
    private GameState executeMove(
            List<String> board,
            List<Integer> currentMoves,
            List<Integer> opponentMoves,
            int move,
            String player) {
        
        List<String> newBoard = new ArrayList<>(board);
        List<Integer> newCurrent = new ArrayList<>(currentMoves);
        List<Integer> newOpponent = new ArrayList<>(opponentMoves);
        
        // Place piece
        newBoard.set(move, player);
        newCurrent.add(move);
        
        // Check win BEFORE vanishing
        String winner = checkWinner(newBoard);
        
        // Vanish ONLY if no win and > 3 pieces
        if (winner == null && newCurrent.size() > 3) {
            int vanish = newCurrent.remove(0);
            newBoard.set(vanish, null);
        }
        
        return new GameState(newBoard, newCurrent, newOpponent);
    }

    /**
     * Fallback offensive move
     */
    private int findBestOffensiveMove(List<String> board, List<Integer> aiMoves,
                                      List<Integer> playerMoves, String aiPlayer, String humanPlayer) {
        List<Integer> moves = getAvailableMoves(board);
        if (moves.isEmpty()) return -1;
        
        int bestMove = moves.get(0);
        int bestScore = Integer.MIN_VALUE;
        
        for (int move : moves) {
            GameState state = executeMove(board, aiMoves, playerMoves, move, aiPlayer);
            int score = evaluatePositionPerfectly(state.board, state.aiMoves, 
                state.playerMoves, aiPlayer, humanPlayer);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }

    private String generateHash(List<String> board, List<Integer> aiMoves,
                                List<Integer> playerMoves, boolean isAi) {
        StringBuilder sb = new StringBuilder();
        for (String c : board) sb.append(c == null ? "_" : c);
        sb.append("|");
        for (Integer m : aiMoves) sb.append(m).append(",");
        sb.append("|");
        for (Integer m : playerMoves) sb.append(m).append(",");
        sb.append("|").append(isAi ? "A" : "P");
        return sb.toString();
    }

    private String checkWinner(List<String> board) {
        for (int[] line : WINNING_LINES) {
            String first = board.get(line[0]);
            if (first != null && first.equals(board.get(line[1])) && 
                first.equals(board.get(line[2]))) {
                return first;
            }
        }
        return null;
    }

    private List<Integer> getAvailableMoves(List<String> board) {
        List<Integer> moves = new ArrayList<>();
        for (int i = 0; i < BOARD_SIZE; i++) {
            if (board.get(i) == null) moves.add(i);
        }
        return moves;
    }

    // Helper classes
    private static class GameState {
        List<String> board;
        List<Integer> currentMoves;
        List<Integer> aiMoves;
        List<Integer> playerMoves;
        
        GameState(List<String> board, List<Integer> currentMoves, List<Integer> opponentMoves) {
            this.board = board;
            this.currentMoves = currentMoves;
            this.aiMoves = currentMoves;
            this.playerMoves = opponentMoves;
        }
    }

    private static class ThreatInfo {
        int pieces;
        boolean willVanish;
        
        ThreatInfo(int pieces, boolean willVanish) {
            this.pieces = pieces;
            this.willVanish = willVanish;
        }
    }

    private static class TranspositionEntry {
        int score;
        int bestMove;
        int depth;
        
        TranspositionEntry(int score, int bestMove, int depth) {
            this.score = score;
            this.bestMove = bestMove;
            this.depth = depth;
        }
    }

    private static class MoveResult {
        int score;
        int moveIndex;

        MoveResult(int score, int moveIndex) {
            this.score = score;
            this.moveIndex = moveIndex;
        }
    }
    
    private static class MoveScore {
        int move;
        int score;
        
        MoveScore(int move, int score) {
            this.move = move;
            this.score = score;
        }
    }
}