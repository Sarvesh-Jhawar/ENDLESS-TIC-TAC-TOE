import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/game.css";

function LocalGame() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xMoves, setXMoves] = useState([]);
  const [oMoves, setOMoves] = useState([]);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [countdownMessage, setCountdownMessage] = useState("");
  const [showRules, setShowRules] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [paused, setPaused] = useState(false);
  const [firstMoveDone, setFirstMoveDone] = useState(false);
  const [preMoveTurn, setPreMoveTurn] = useState(null);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

  const [selectedTimer, setSelectedTimer] = useState(3);

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (currentBoard) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { player: currentBoard[a], line: lines[i] };
      }
    }
    return null;
  };

  // Countdown for first move
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      const next = countdown - 1;
      setCountdown(next);
      setCountdownMessage(next > 0 ? `${next}` : "Tap to make first move!");
      if (next === 0) {
        const randomTurn = Math.random() < 0.5;
        setPreMoveTurn(randomTurn);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Turn timer
  useEffect(() => {
    if (!gameStarted || winnerInfo || paused || !firstMoveDone || selectedTimer === "no") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setXIsNext(!xIsNext);
          return selectedTimer;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, winnerInfo, xIsNext, paused, firstMoveDone, selectedTimer]);

  useEffect(() => {
    if (gameStarted && !winnerInfo && selectedTimer !== "no") setTimeLeft(selectedTimer);
  }, [xIsNext, gameStarted, winnerInfo, selectedTimer]);

  const startGameCountdown = () => {
    setBoard(Array(9).fill(null));
    setXMoves([]);
    setOMoves([]);
    setWinnerInfo(null);
    setGameStarted(false);
    setFirstMoveDone(false);
    setCountdown(3);
    setCountdownMessage("3");
    setPreMoveTurn(null);
    setShowPopup(false);
    setShowWinnerAnnouncement(false);
    setTimeLeft(selectedTimer !== "no" ? selectedTimer : 0);
  };

  const handleClick = (index) => {
    if (board[index] || winnerInfo || paused || countdown > 0) return;

    if (!firstMoveDone) {
      setGameStarted(true);
      setFirstMoveDone(true);
      setXIsNext(preMoveTurn);
      setPreMoveTurn(null);
    }

    const newBoard = [...board];
    const currentPlayer = xIsNext ? "X" : "O";
    newBoard[index] = currentPlayer;

    const winner = checkWinner(newBoard);

    let newMoves = currentPlayer === "X" ? [...xMoves, index] : [...oMoves, index];
    if (!winner && newMoves.length > 3) {
      const oldestMove = newMoves.shift();
      newBoard[oldestMove] = null;
    }

    if (currentPlayer === "X") setXMoves(newMoves);
    else setOMoves(newMoves);

    setBoard(newBoard);

    if (winner) {
      setWinnerInfo(winner);
      setPaused(true);
      setShowWinnerAnnouncement(true);
      setTimeout(() => {
        setPopupType("win");
        setShowPopup(true);
        setShowWinnerAnnouncement(false);
      }, 2000);
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const handleRestart = () => {
    if (board.every((cell) => cell === null)) return;
    setPaused(true);
    setPopupType("restart");
    setShowPopup(true);
  };

  const handleQuit = () => {
    setPaused(true);
    setPopupType("quit");
    setShowPopup(true);
  };

  const confirmAction = (yes) => {
    setShowPopup(false);
    setPaused(false);

    if (yes) {
      if (popupType === "restart" || popupType === "win") {
        startGameCountdown();
      } else if (popupType === "quit") {
        navigate("/");
      }
    }
    setPopupType(null);
  };

  const renderCell = (index) => {
    const player = board[index];
    const classNames = `cell ${player ? (player === "X" ? "red" : "blue") : ""}`;
    return (
      <div key={index} className={classNames} onClick={() => handleClick(index)}>
        {player && <span className="mark">{player}</span>}
      </div>
    );
  };

  const getWinningLineClass = () => {
    if (!winnerInfo) return "";

    const [a, b, c] = winnerInfo.line;

    if (a === 0 && b === 1 && c === 2) return "line-h-1";
    if (a === 3 && b === 4 && c === 5) return "line-h-2";
    if (a === 6 && b === 7 && c === 8) return "line-h-3";

    if (a === 0 && b === 3 && c === 6) return "line-v-1";
    if (a === 1 && b === 4 && c === 7) return "line-v-2";
    if (a === 2 && b === 5 && c === 8) return "line-v-3";

    if (a === 0 && b === 4 && c === 8) return "line-d-1";
    if (a === 2 && b === 4 && c === 6) return "line-d-2";

    return "";
  };

  if (showRules) {
    return (
      <div className="game-container rules-container">
        <h2>Game Rules</h2>
        <ul>
          <li>This is an "endless" Tic Tac Toe.</li>
          <li>Each player can have a maximum of 3 marks on the board.</li>
          <li>When a player places their 4th mark, the first mark is removed.</li>
          <li>The first player to get 3 marks in a row, column, or diagonal wins.</li>
          <li>
            Each player has a time limit to make a move:{" "}
            {selectedTimer === "no" ? "No Timer" : `${selectedTimer}s`}
          </li>
        </ul>

        <div className="timer-select">
          <label htmlFor="timer-dropdown">Select Timer: </label>
          <select
            id="timer-dropdown"
            value={selectedTimer}
            onChange={(e) =>
              setSelectedTimer(e.target.value === "no" ? "no" : parseInt(e.target.value))
            }
          >
            <option value={2}>2 sec</option>
            <option value={3}>3 sec (recommended)</option>
            <option value={4}>4 sec</option>
            <option value="no">No Timer</option>
          </select>
        </div>

        <button
          className="btn btn-start"
          onClick={() => {
            setShowRules(false);
            startGameCountdown();
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      {countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown">{countdownMessage}</div>
        </div>
      )}

      {preMoveTurn !== null && countdown === 0 && !firstMoveDone && (
        <div className="pre-move-turn">
          {preMoveTurn ? "🔴 Red's Turn (first move)" : "🔵 Blue's Turn (first move)"}
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-dialog">
            <p>
              {popupType === "restart"
                ? "Do you want to restart?"
                : popupType === "quit"
                ? "Do you want to quit?"
                : popupType === "win"
                ? "Play again or quit?"
                : ""}
            </p>
            <div className="popup-buttons">
              <button className="btn-yes" onClick={() => confirmAction(true)}>
                {popupType === "win" ? "Play Again" : "Yes"}
              </button>
              <button className="btn-no" onClick={() => confirmAction(false)}>
                {popupType === "win" ? "Quit" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2>Endless Tic Tac Toe</h2>

      {showWinnerAnnouncement && winnerInfo && (
        <div
          className={`winner-announcement ${winnerInfo.player === "X" ? "red-win" : "blue-win"}`}
        >
          {`${winnerInfo.player === "X" ? "🔴 Red" : "🔵 Blue"} wins!`}
        </div>
      )}

      {!gameStarted && !winnerInfo && !showPopup && countdown <= 0 && (
        <div className="tap-to-start">Tap on the board to make the first move</div>
      )}

      {gameStarted && !winnerInfo && !showPopup && (
        <div className="status-container">
          <div className={`turn-indicator ${xIsNext ? "red-turn" : "blue-turn"}`}>
            {xIsNext ? "🔴 Red's Turn" : "🔵 Blue's Turn"}
          </div>
          {selectedTimer !== "no" && (
            <div className="timer-container">
              <div className="timer-bar">
                <div
                  className="timer-progress"
                  style={{ width: `${(timeLeft / selectedTimer) * 100}%` }}
                ></div>
              </div>
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      )}

      <div className="board">
        {board.map((_, i) => renderCell(i))}
        {winnerInfo && <div className={`winning-line ${getWinningLineClass()}`}></div>}
      </div>

      {!winnerInfo && !showPopup && (
        <div className="buttons">
          {board.some((cell) => cell !== null) && (
            <button className="btn btn-restart" onClick={handleRestart}>
              Restart
            </button>
          )}
          <button className="btn btn-quit" onClick={handleQuit}>
            Quit
          </button>
        </div>
      )}
    </div>
  );
}

export default LocalGame;
