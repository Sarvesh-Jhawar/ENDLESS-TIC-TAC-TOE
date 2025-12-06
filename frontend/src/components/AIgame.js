import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/game.css";

function AIgame({ playerMark: initialPlayerMark, aiMark: initialAiMark, onQuit }) {
  const emptyBoard = Array(9).fill(null);

  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayerMark);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [isCountdown, setIsCountdown] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState([]);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [aiMoves, setAiMoves] = useState([]);
  const [dyingPositions, setDyingPositions] = useState([]);
  
  // Championship tracking
  const [roundsWon, setRoundsWon] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [championshipOver, setChampionshipOver] = useState(false);
  
  // Time pressure
  const [moveTimer, setMoveTimer] = useState(2);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  // Round countdown
  useEffect(() => {
    if (isCountdown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIsCountdown(false);
        setCountdown(3);
        setIsPlayerTurn(currentPlayer === initialPlayerMark);
      }
    }
  }, [countdown, isCountdown, currentPlayer, initialPlayerMark]);

  // Move timer (2 seconds per move)
  useEffect(() => {
    if (!isCountdown && !gameOver && isPlayerTurn) {
      if (moveTimer > 0) {
        const timer = setTimeout(() => setMoveTimer(moveTimer - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Time's up! Player loses
        handleTimeout();
      }
    }
  }, [moveTimer, isCountdown, gameOver, isPlayerTurn]);

  // Update dying positions (ONLY for player)
  useEffect(() => {
    const dying = [];
    if (playerMoves.length === 3 && !gameOver) {
      dying.push(playerMoves[0]);
    }
    setDyingPositions(dying);
  }, [playerMoves, gameOver]);

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

  const addMove = (movesArray, index, mark, boardCopy) => {
    boardCopy[index] = mark;
    let newMoves = [...movesArray, index];
    const result = checkWinner(boardCopy);
    
    if (!result && newMoves.length > 3) {
      const oldest = newMoves.shift();
      boardCopy[oldest] = null;
    }
    
    return newMoves;
  };

  const handleTimeout = () => {
    setMessage("Time's up! You lose this round!");
    setGameOver(true);
    setTotalRounds(totalRounds + 1);
    
    // AI wins = Championship over
    setTimeout(() => {
      setChampionshipOver(true);
    }, 2000);
  };

  const handleCellClick = async (index) => {
    if (board[index] || currentPlayer !== initialPlayerMark || isCountdown || gameOver || !isPlayerTurn) return;

    // Reset timer for next turn
    setMoveTimer(2);

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
    setIsPlayerTurn(false);

    // Call backend for AI move
    try {
      const response = await axios.post("http://localhost:8080/api/game/aiMove", {
        board: newBoard,
        currentPlayer: initialAiMark,
        difficulty: "hard", // Always hard mode
        playerMoves: newPlayerMoves,
        aiMoves: aiMoves,
      });

      const aiMoveIndex = response.data.moveIndex;
      const moveMade = response.data.moveMade;

      if (moveMade && aiMoveIndex !== -1) {
        setTimeout(() => {
          let boardCopy = [...newBoard];
          const newAiMoves = addMove(aiMoves, aiMoveIndex, initialAiMark, boardCopy);
          setBoard(boardCopy);
          setAiMoves(newAiMoves);

          // Check if AI won
          const aiResult = checkWinner(boardCopy);
          if (aiResult) {
            handleWinner(aiResult.winner, aiResult.line);
          } else {
            setCurrentPlayer(initialPlayerMark);
            setIsPlayerTurn(true);
            setMoveTimer(2); // Reset timer for player's next turn
          }
        }, 500);
      } else {
        setCurrentPlayer(initialPlayerMark);
        setIsPlayerTurn(true);
        setMoveTimer(2);
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      setCurrentPlayer(initialPlayerMark);
      setIsPlayerTurn(true);
      setMoveTimer(2);
    }
  };

  const handleWinner = (winner, line) => {
    setWinningLine(line);
    setIsPlayerTurn(false);
    
    setTimeout(() => {
      if (winner === initialPlayerMark) {
        // Player wins this round
        const newRoundsWon = roundsWon + 1;
        setRoundsWon(newRoundsWon);
        setTotalRounds(totalRounds + 1);
        
        if (newRoundsWon === 5) {
          setMessage(`🎉 CHAMPION! You defeated the AI 5 times!`);
          setChampionshipOver(true);
        } else {
          setMessage(`Round won! (${newRoundsWon}/5 victories)`);
        }
      } else {
        // AI wins = Championship over immediately
        setMessage("AI wins! Championship over!");
        setTotalRounds(totalRounds + 1);
        setTimeout(() => {
          setChampionshipOver(true);
        }, 2000);
      }
      setGameOver(true);
    }, 800);
  };

  const nextRound = () => {
    setBoard(emptyBoard);
    setMessage("");
    setWinningLine([]);
    setPlayerMoves([]);
    setAiMoves([]);
    setDyingPositions([]);
    setGameOver(false);
    setIsCountdown(true);
    setMoveTimer(2);
    
    // Randomize marks for next round
    const marks = ["X", "O"];
    const randomPlayer = marks[Math.floor(Math.random() * 2)];
    const randomAI = randomPlayer === "X" ? "O" : "X";
    setCurrentPlayer(randomPlayer);
  };

  const restartChampionship = () => {
    setBoard(emptyBoard);
    setCurrentPlayer(initialPlayerMark);
    setMessage("");
    setWinningLine([]);
    setPlayerMoves([]);
    setAiMoves([]);
    setDyingPositions([]);
    setGameOver(false);
    setIsCountdown(true);
    setRoundsWon(0);
    setTotalRounds(0);
    setChampionshipOver(false);
    setMoveTimer(2);
    setIsPlayerTurn(false);
  };

  return (
    <div>
      {/* Championship Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        padding: '15px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
        color: 'white'
      }}>
        <h2 style={{ margin: '5px 0', fontSize: '1.8rem' }}>⚔️ CHAMPIONSHIP MODE ⚔️</h2>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px' }}>
          🏆 Player Victories: {roundsWon}/5
        </div>
        <div style={{ fontSize: '0.9rem', marginTop: '5px', opacity: 0.9 }}>
          Total Rounds Played: {totalRounds}
        </div>
        <div style={{ fontSize: '0.85rem', marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}>
          ⚡ Win 5 rounds to become champion! One AI victory = Game Over!
        </div>
      </div>

      {isCountdown ? (
        <p className="countdown" style={{ fontSize: '3rem', textAlign: 'center', color: '#ff6b6b' }}>
          Round {totalRounds + 1} starts in: {countdown}
        </p>
      ) : (
        <>
          {/* Timer Display */}
          {!gameOver && isPlayerTurn && (
            <div style={{
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '15px 0',
              color: moveTimer <= 1 ? '#ff4444' : '#4CAF50',
              animation: moveTimer <= 1 ? 'pulse 0.5s infinite' : 'none'
            }}>
              ⏱️ Time: {moveTimer}s
            </div>
          )}

          <div className="board">
            {board.map((cell, index) => {
              const isWinningCell = winningLine.includes(index);
              const isDying = dyingPositions.includes(index);
              
              return (
                <div
                  key={index}
                  className={`cell ${cell === "X" ? "red" : cell === "O" ? "blue" : ""} ${isWinningCell ? "winning" : ""}`}
                  onClick={() => handleCellClick(index)}
                  style={{ position: 'relative' }}
                >
                  {cell && <span className="mark">{cell}</span>}
                  
                  {/* Dying indicator */}
                  {isDying && cell && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '8px',
                        color: '#facc15',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))',
                        pointerEvents: 'none'
                      }}
                    >
                      !
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className={`turn-indicator ${currentPlayer === "X" ? "red-turn" : "blue-turn"}`}>
            {gameOver ? "Round Over" : isPlayerTurn ? "⚡ YOUR TURN - MOVE FAST!" : "🤖 AI is thinking..."}
          </p>

          {message && (
            <p className={`winner-announcement ${message.includes("You") || message.includes("won") || message.includes("CHAMPION") ? "red-win" : "blue-win"}`}>
              {message}
            </p>
          )}

          {/* Championship Over Modal */}
          {championshipOver && (
            <div className="popup-overlay">
              <div className="popup-dialog" style={{ minWidth: '400px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>
                  {roundsWon === 5 ? "🏆 CHAMPION! 🏆" : "💀 DEFEATED 💀"}
                </h2>
                <div style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                  {roundsWon === 5 
                    ? `You conquered the unbeatable AI with ${roundsWon} victories!` 
                    : `The AI won! You managed ${roundsWon} victories before falling.`
                  }
                </div>
                <div style={{ fontSize: '1rem', marginBottom: '20px', opacity: 0.8 }}>
                  Total rounds played: {totalRounds}
                </div>
                <div className="popup-buttons">
                  <button className="btn-yes" onClick={restartChampionship}>
                    New Championship
                  </button>
                  <button className="btn-no" onClick={onQuit}>Main Menu</button>
                </div>
              </div>
            </div>
          )}

          {/* Round Over Modal (but championship continues) */}
          {gameOver && !championshipOver && (
            <div className="popup-overlay">
              <div className="popup-dialog">
                <p style={{ fontSize: '1.3rem', marginBottom: '15px' }}>{message}</p>
                <div className="popup-buttons">
                  <button className="btn-yes" onClick={nextRound}>
                    {message.includes("AI wins") ? "Try Again" : "Next Round →"}
                  </button>
                  <button className="btn-no" onClick={onQuit}>Quit Championship</button>
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