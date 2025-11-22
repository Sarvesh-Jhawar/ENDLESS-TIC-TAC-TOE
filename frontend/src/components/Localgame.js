import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [showNameInput, setShowNameInput] = useState(false);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [paused, setPaused] = useState(false);
  const [firstMoveDone, setFirstMoveDone] = useState(false);
  const [preMoveTurn, setPreMoveTurn] = useState(null);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

  const [selectedTimer, setSelectedTimer] = useState(3);
  const [totalRounds, setTotalRounds] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(null);
  const [roundTimes, setRoundTimes] = useState([]);
  const [roundWinners, setRoundWinners] = useState([]);

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
    setRoundStartTime(null); // Will be set when first move is made
    // Reset scores and stats if starting from round 1
    if (currentRound === 1) {
      setPlayer1Score(0);
      setPlayer2Score(0);
      setRoundTimes([]);
      setRoundWinners([]);
    }
  };

  const startNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      startGameCountdown();
    }
  };

  const handleClick = (index) => {
    if (board[index] || winnerInfo || paused || countdown > 0) return;

    if (!firstMoveDone) {
      setGameStarted(true);
      setFirstMoveDone(true);
      setXIsNext(preMoveTurn);
      setPreMoveTurn(null);
      setRoundStartTime(Date.now()); // Start timer for this round
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
      
      // Calculate round time
      const roundTime = roundStartTime ? Math.floor((Date.now() - roundStartTime) / 1000) : 0;
      
      // Update scores and round data - use functional updates to ensure correct state
      const winnerName = winner.player === "X" ? (player1Name || "Player 1") : (player2Name || "Player 2");
      
      setRoundWinners(prev => [...prev, { round: currentRound, winner: winnerName, mark: winner.player, time: roundTime }]);
      setRoundTimes(prev => [...prev, roundTime]);
      
      // Update scores with functional update
      if (winner.player === "X") {
        setPlayer1Score(prev => prev + 1);
      } else {
        setPlayer2Score(prev => prev + 1);
      }
      
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
      if (popupType === "restart") {
        setCurrentRound(1);
        setPlayer1Score(0);
        setPlayer2Score(0);
        setRoundTimes([]);
        setRoundWinners([]);
        startGameCountdown();
      } else if (popupType === "win") {
        if (currentRound < totalRounds) {
          startNextRound();
        } else {
          // All rounds done, go back to rules screen
          setCurrentRound(1);
          setPlayer1Score(0);
          setPlayer2Score(0);
          setRoundTimes([]);
          setRoundWinners([]);
          setShowRules(true);
          setShowNameInput(false);
        }
      } else if (popupType === "quit") {
        navigate("/");
      }
    }
    setPopupType(null);
  };

  const renderCell = (index) => {
    const player = board[index];
    const isRed = player === "X";
    const isBlue = player === "O";
    return (
      <div
        key={index}
        className={`w-24 h-24 sm:w-28 sm:h-28 bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-5xl sm:text-6xl font-bold cursor-pointer transition-all duration-300 hover:bg-slate-700/80 hover:-translate-y-1 hover:scale-105 shadow-lg border border-slate-700/50 ${
          isRed
            ? "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]"
            : isBlue
            ? "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,1)]"
            : ""
        }`}
        onClick={() => handleClick(index)}
      >
        {player && (
          <span className="animate-[scale-in_0.3s_ease-out]">
            {player}
          </span>
        )}
      </div>
    );
  };

  const getWinningLineStyle = () => {
    if (!winnerInfo) return {};

    const [a, b, c] = winnerInfo.line;

    // Horizontal lines
    if (a === 0 && b === 1 && c === 2)
      return {
        top: "50px",
        left: 0,
        width: "100%",
        height: "8px",
      };
    if (a === 3 && b === 4 && c === 5)
      return {
        top: "155px",
        left: 0,
        width: "100%",
        height: "8px",
      };
    if (a === 6 && b === 7 && c === 8)
      return {
        top: "260px",
        left: 0,
        width: "100%",
        height: "8px",
      };

    // Vertical lines
    if (a === 0 && b === 3 && c === 6)
      return {
        left: "50px",
        top: 0,
        width: "8px",
        height: "100%",
      };
    if (a === 1 && b === 4 && c === 7)
      return {
        left: "155px",
        top: 0,
        width: "8px",
        height: "100%",
      };
    if (a === 2 && b === 5 && c === 8)
      return {
        left: "260px",
        top: 0,
        width: "8px",
        height: "100%",
      };

    // Diagonal lines
    if (a === 0 && b === 4 && c === 8)
      return {
        top: 0,
        left: 0,
        width: "150%",
        height: "8px",
        transform: "rotate(45deg)",
        transformOrigin: "top left",
      };
    if (a === 2 && b === 4 && c === 6)
      return {
        top: 0,
        right: 0,
        width: "150%",
        height: "8px",
        transform: "rotate(-45deg)",
        transformOrigin: "top right",
      };

    return {};
  };

  if (showRules) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-start gap-8 p-8 bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-[500px] border border-slate-700/50">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent self-center m-0">
          Game Rules
        </h2>
        <ul className="list-none p-0 m-0 mb-8 text-left">
          <li className="text-lg sm:text-xl mb-4 leading-relaxed">
            This is an "endless" Tic Tac Toe.
          </li>
          <li className="text-lg sm:text-xl mb-4 leading-relaxed">
            Each player can have a maximum of 3 marks on the board.
          </li>
          <li className="text-lg sm:text-xl mb-4 leading-relaxed">
            When a player places their 4th mark, the first mark is removed.
          </li>
          <li className="text-lg sm:text-xl mb-4 leading-relaxed">
            The first player to get 3 marks in a row, column, or diagonal wins.
          </li>
          <li className="text-lg sm:text-xl mb-4 leading-relaxed">
            Each player has a time limit to make a move:{" "}
            {selectedTimer === "no" ? "No Timer" : `${selectedTimer}s`}
          </li>
        </ul>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-center gap-2.5 text-lg text-white">
            <label htmlFor="timer-dropdown" className="font-bold">
              Select Timer:{" "}
            </label>
            <select
              id="timer-dropdown"
              value={selectedTimer}
              onChange={(e) =>
                setSelectedTimer(e.target.value === "no" ? "no" : parseInt(e.target.value))
              }
              className="px-3 py-2 rounded-lg border-2 border-white bg-slate-900 text-white text-base font-bold cursor-pointer transition-all duration-300 hover:border-red-500 hover:scale-105 focus:border-red-500 focus:outline-none focus:shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            >
              <option value={2} className="bg-slate-900 text-white">
                2 sec
              </option>
              <option value={3} className="bg-slate-900 text-white">
                3 sec (recommended)
              </option>
              <option value={4} className="bg-slate-900 text-white">
                4 sec
              </option>
              <option value="no" className="bg-slate-900 text-white">
                No Timer
              </option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-lg text-white">
            <label htmlFor="rounds-dropdown" className="font-bold">
              Number of Rounds:{" "}
            </label>
            <select
              id="rounds-dropdown"
              value={totalRounds}
              onChange={(e) => setTotalRounds(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg border-2 border-white bg-slate-900 text-white text-base font-bold cursor-pointer transition-all duration-300 hover:border-blue-500 hover:scale-105 focus:border-blue-500 focus:outline-none focus:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            >
              <option value={1} className="bg-slate-900 text-white">
                1 Round
              </option>
              <option value={3} className="bg-slate-900 text-white">
                3 Rounds
              </option>
              <option value={5} className="bg-slate-900 text-white">
                5 Rounds
              </option>
            </select>
          </div>
        </div>

        <button
          className="w-full px-6 py-4 text-xl font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:-translate-y-1 hover:shadow-2xl"
          onClick={() => {
            setShowRules(false);
            setShowNameInput(true);
          }}
        >
          Continue
        </button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-8 p-8 bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-[500px] border border-slate-700/50">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Enter Player Names
          </h2>
          
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <label htmlFor="player1" className="block text-lg font-semibold text-white">
                Player 1 (X) <span className="text-red-500">●</span>
              </label>
              <input
                id="player1"
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value.trim())}
                placeholder="Enter Player 1 name"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-red-500 focus:outline-none transition-all duration-300"
                maxLength={20}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="player2" className="block text-lg font-semibold text-white">
                Player 2 (O) <span className="text-blue-500">●</span>
              </label>
              <input
                id="player2"
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value.trim())}
                placeholder="Enter Player 2 name"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                maxLength={20}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && player1Name && player2Name) {
                    setShowNameInput(false);
                    startGameCountdown();
                  }
                }}
              />
            </div>
          </div>

          <button
            className="w-full px-6 py-4 text-xl font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (player1Name && player2Name) {
                setShowNameInput(false);
                startGameCountdown();
              }
            }}
            disabled={!player1Name || !player2Name}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 p-8 bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-[500px] relative border border-slate-700/50">
      {countdown > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900/90 flex justify-center items-center z-[1000]">
          <div className="text-[10rem] font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-[countdown-animation_1s_infinite]">
            {countdownMessage}
          </div>
        </div>
      )}

      {preMoveTurn !== null && countdown === 0 && !firstMoveDone && (
        <div className="text-xl font-semibold text-white">
          {preMoveTurn 
            ? `${player1Name || "Player 1"}'s Turn (X) - First Move` 
            : `${player2Name || "Player 2"}'s Turn (O) - First Move`}
        </div>
      )}

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900/80 flex justify-center items-center z-[1000] animate-[fade-in_0.3s_ease-out]">
          <div className="bg-slate-800 p-8 sm:p-12 rounded-2xl shadow-2xl text-center animate-[slide-up_0.4s_ease-out]">
            <div className="text-xl sm:text-2xl m-0 mb-8 text-white space-y-4">
              {popupType === "restart" ? (
                <p>Do you want to restart?</p>
              ) : popupType === "quit" ? (
                <p>Do you want to quit?</p>
              ) : popupType === "win" ? (
                <>
                  <p className="font-bold text-2xl">
                    {winnerInfo?.player === "X" 
                      ? `${player1Name || "Player 1"} (X) wins this round!`
                      : `${player2Name || "Player 2"} (O) wins this round!`}
                  </p>
                  {currentRound < totalRounds ? (
                    <p className="text-lg text-slate-300">
                      Round {currentRound} of {totalRounds} completed
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-lg text-slate-300">All rounds completed!</p>
                      <p className="text-xl font-bold">
                        {player1Score > player2Score 
                          ? `${player1Name || "Player 1"} wins the match!`
                          : player2Score > player1Score
                          ? `${player2Name || "Player 2"} wins the match!`
                          : "It's a tie!"}
                      </p>
                      
                      {/* Stats Section */}
                      <div className="bg-slate-900/50 rounded-xl p-4 space-y-3 mt-4">
                        <p className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Match Statistics</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Final Score</p>
                            <p className="text-white font-bold text-lg">
                              {player1Name || "Player 1"} {player1Score} - {player2Score} {player2Name || "Player 2"}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Total Rounds</p>
                            <p className="text-white font-bold text-lg">{totalRounds}</p>
                          </div>
                        </div>

                        {roundWinners.length > 0 && (
                          <div className="mt-4">
                            <p className="text-slate-400 mb-2">Round Results</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {roundWinners.map((round, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-800/50 rounded-lg px-3 py-2 text-sm">
                                  <span className="text-white">
                                    Round {round.round}: <span className={round.mark === "X" ? "text-red-500" : "text-blue-500"}>{round.winner} ({round.mark})</span>
                                  </span>
                                  <span className="text-slate-400">{round.time}s</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {roundTimes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-slate-400 text-xs">
                              Average Round Time: {Math.floor(roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length)}s
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 px-6 py-3 text-lg sm:text-xl font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:-translate-y-1 hover:shadow-2xl"
                onClick={() => confirmAction(true)}
              >
                {popupType === "win" 
                  ? (currentRound < totalRounds ? "Next Round" : "Play Again")
                  : "Yes"}
              </button>
              <button
                className="flex-1 px-6 py-3 text-lg sm:text-xl font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 bg-slate-700 text-gray-100 shadow-lg hover:-translate-y-1 hover:shadow-2xl"
                onClick={() => confirmAction(false)}
              >
                {popupType === "win" ? "Quit" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent m-0">
          Endless Tic Tac Toe
        </h2>
        <div className="text-lg font-semibold text-slate-300">
          Round {currentRound} of {totalRounds}
        </div>
        <div className="flex justify-center items-center gap-6 text-base">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">●</span>
            <span className="text-white">{player1Name || "Player 1"}:</span>
            <span className="text-red-500 font-bold text-xl">{player1Score}</span>
          </div>
          <span className="text-slate-500">vs</span>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-bold">●</span>
            <span className="text-white">{player2Name || "Player 2"}:</span>
            <span className="text-blue-500 font-bold text-xl">{player2Score}</span>
          </div>
        </div>
      </div>

      {showWinnerAnnouncement && winnerInfo && (
        <div
          className={`text-4xl sm:text-5xl font-bold text-center animate-[winner-pop_0.5s_ease-out,fade-out_0.5s_ease-in_1.5s_forwards] ${
            winnerInfo.player === "X"
              ? "text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]"
              : "text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,1)]"
          }`}
        >
          {`${winnerInfo.player === "X" ? player1Name || "Player 1" : player2Name || "Player 2"} (${winnerInfo.player}) wins!`}
        </div>
      )}

      {!gameStarted && !winnerInfo && !showPopup && countdown <= 0 && (
        <div className="text-lg text-white">Tap on the board to make the first move</div>
      )}

      {gameStarted && !winnerInfo && !showPopup && (
        <div className="w-full flex justify-between items-center">
          <div
            className={`text-xl sm:text-2xl font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
              xIsNext
                ? "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]"
                : "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,1)]"
            }`}
          >
            {xIsNext 
              ? `${player1Name || "Player 1"}'s Turn (X)` 
              : `${player2Name || "Player 2"}'s Turn (O)`}
          </div>
          {selectedTimer !== "no" && (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-8 h-8 ${
                  timeLeft <= 3 ? "text-red-500 animate-shake" : "text-white"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="w-24 h-2.5 bg-slate-700 rounded-md overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition-all duration-200"
                  style={{ width: `${(timeLeft / selectedTimer) * 100}%` }}
                ></div>
              </div>
              <span className="text-white font-semibold">{timeLeft}s</span>
            </div>
          )}
        </div>
      )}

      <div className="relative grid grid-cols-3 gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
        {board.map((_, i) => renderCell(i))}
        {winnerInfo && (
          <div
            className="absolute bg-yellow-400 rounded z-10"
            style={getWinningLineStyle()}
          ></div>
        )}
      </div>

      {!winnerInfo && !showPopup && (
        <div className="flex gap-4 w-full">
          {board.some((cell) => cell !== null) && (
            <button
              className="flex-1 px-6 py-4 text-xl font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 bg-slate-700 text-gray-100 shadow-lg hover:-translate-y-1 hover:shadow-2xl"
              onClick={handleRestart}
            >
              Restart
            </button>
          )}
          <button
            className="flex-1 px-6 py-4 text-xl font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 bg-slate-700 text-gray-100 shadow-lg hover:-translate-y-1 hover:shadow-2xl"
            onClick={handleQuit}
          >
            Quit
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

export default LocalGame;
