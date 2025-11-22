import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/game.css";

function AIgame({ playerMark: initialPlayerMark, aiMark: initialAiMark, level: initialLevel, setLevel, onQuit }) {
  const emptyBoard = Array(9).fill(null);

  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayerMark);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [isCountdown, setIsCountdown] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState([]);
  const [playerMoves, setPlayerMoves] = useState([]); // stores player's last 3 moves
  const [aiMoves, setAiMoves] = useState([]);         // stores AI's last 3 moves

  // Map level to difficulty
  const levelDifficultyMap = {
    1: "easy",
    2: "medium",
    3: "hard",
  };

  // Countdown before level starts
  useEffect(() => {
    if (isCountdown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIsCountdown(false);
        setCountdown(3);
      }
    }
  }, [countdown, isCountdown]);

  // Check winner and return winning line
  const checkWinner = (b) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let line of lines) {
      const [a,b1,c] = line;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
    }
    return null;
  };

  // Sliding window for moves
 const addMove = (movesArray, index, mark, boardCopy) => {
  let newMoves = [...movesArray, index];

  // Place the new mark first
  boardCopy[index] = mark;

  // Only remove oldest if moves > 3 AND no winner on this move
  if (newMoves.length > 3) {
    // Check for win before removing oldest
    const tempBoard = [...boardCopy];
    const result = checkWinner(tempBoard);
    if (!result) {
      const oldest = newMoves.shift();
      boardCopy[oldest] = null;
    } else {
      // winner found, don't remove oldest
      newMoves.pop(); // keep moves array consistent
    }
  }

  return newMoves;
};


  // Handle cell click
 const handleCellClick = async (index) => {
  if (board[index] || currentPlayer !== initialPlayerMark || isCountdown || gameOver) return;

  // Player move
  let newBoard = [...board];
  const newPlayerMoves = addMove(playerMoves, index, initialPlayerMark, newBoard);
  setBoard(newBoard);
  setPlayerMoves(newPlayerMoves);

  // Check if player won
  const result = checkWinner(newBoard);
  if (result) {
    handleWinner(result.winner, result.line);
    return;
  }

  setCurrentPlayer(initialAiMark);

  // Call backend for AI move
  try {
    const response = await axios.post("http://localhost:8080/api/game/aiMove", {
      board: newBoard,
      currentPlayer: initialAiMark,
      difficulty: levelDifficultyMap[initialLevel],
      playerMoves: newPlayerMoves,
      aiMoves: aiMoves,
    });

    const aiMoveIndex = response.data.moveIndex;
    const moveMade = response.data.moveMade;

    if (moveMade && aiMoveIndex !== -1) {
      // Wait a bit before showing AI move
      setTimeout(() => {
        let boardCopy = [...newBoard];
        const newAiMoves = addMove(aiMoves, aiMoveIndex, initialAiMark, boardCopy);
        setBoard(boardCopy);
        setAiMoves(newAiMoves);

        // Check if AI won
        const aiResult = checkWinner(boardCopy);
        if (aiResult) handleWinner(aiResult.winner, aiResult.line);
        else setCurrentPlayer(initialPlayerMark);
      }, 500);
    } else {
      setCurrentPlayer(initialPlayerMark);
    }
  } catch (error) {
    console.error("Error calling AI:", error);
    setCurrentPlayer(initialPlayerMark);
  }
};


  // Handle winner
  const handleWinner = (winner, line) => {
    setWinningLine(line);
    setTimeout(() => {
    if (winner === initialPlayerMark) {
      setMessage(`You won level ${initialLevel}!`);
    } else {
      setMessage("AI won! Try again.");
    }
    setGameOver(true);
  }, 800); // 0.8 seconds delay to see the winning line
};

  // Restart level
  const restartLevel = () => {
    setBoard(emptyBoard);
    setCurrentPlayer(initialPlayerMark);
    setMessage("");
    setWinningLine([]);
    setPlayerMoves([]);
    setAiMoves([]);
    setGameOver(false);
    setIsCountdown(true);
  };

  // Next level
  const nextLevel = () => {
    setLevel(initialLevel + 1);
    setBoard(emptyBoard);
    setMessage("");
    setWinningLine([]);
    setPlayerMoves([]);
    setAiMoves([]);
    setGameOver(false);
    setIsCountdown(true);

    // Randomize X/O marks
    const marks = ["X", "O"];
    const randomPlayer = marks[Math.floor(Math.random() * 2)];
    const randomAI = randomPlayer === "X" ? "O" : "X";
    setCurrentPlayer(initialPlayerMark);
    initialPlayerMark = randomPlayer;
    initialAiMark = randomAI;
  };

  return (
    <div>
      <h2>Level {initialLevel}</h2>
      {isCountdown ? (
        <p className="countdown">Get ready: {countdown}</p>
      ) : (
        <>
          <div className="board">
            {board.map((cell, index) => {
              const isWinningCell = winningLine.includes(index);
              return (
                <div
                  key={index}
                  className={`cell ${cell === "X" ? "red" : cell === "O" ? "blue" : ""} ${isWinningCell ? "winning" : ""}`}
                  onClick={() => handleCellClick(index)}
                >
                  {cell && <span className="mark">{cell}</span>}
                </div>
              );
            })}
          </div>

          <p className={`turn-indicator ${currentPlayer === "X" ? "red-turn" : "blue-turn"}`}>
            {gameOver ? "Game Over" : currentPlayer === initialPlayerMark ? "Your turn" : "AI's turn"}
          </p>

          {message && <p className={`winner-announcement ${message.includes("You") ? "red-win" : "blue-win"}`}>{message}</p>}

          {gameOver && (
            <div className="popup-overlay">
              <div className="popup-dialog">
                <p>{message}</p>
                <div className="popup-buttons">
                  {message.includes("You won") && initialLevel < 3 && (
                    <button className="btn-yes" onClick={nextLevel}>Next Level</button>
                  )}
                  <button className="btn-yes" onClick={restartLevel}>
                    {message.includes("AI won") ? "Play Again" : "Restart Level"}
                  </button>
                  <button className="btn-no" onClick={onQuit}>Quit</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AIgame;
