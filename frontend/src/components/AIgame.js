import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Helmet } from 'react-helmet-async';
import SoundButton from "./SoundButton";
import { useSound } from "../contexts/SoundContext";
import LeaderboardForm from "./LeaderboardForm";
import LeaderboardDisplay from "./LeaderboardDisplay";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function AIgame({ playerMark: initialPlayerMark, aiMark: initialAiMark, onQuit }) {
  const emptyBoard = Array(9).fill(null);
  const { playSound } = useSound();

  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayerMark);
  const [message, setMessage] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState([]);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [aiMoves, setAiMoves] = useState([]);
  const [dyingPositions, setDyingPositions] = useState([]);

  const [roundsWon, setRoundsWon] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [championshipOver, setChampionshipOver] = useState(false);

  const [moveTimer, setMoveTimer] = useState(1.5);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [pendingAiMove, setPendingAiMove] = useState(false);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [showRoundStart, setShowRoundStart] = useState(true);
  const [roundStarter, setRoundStarter] = useState("player");
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showLeaderboardForm, setShowLeaderboardForm] = useState(false);
  const [showLeaderboardDisplay, setShowLeaderboardDisplay] = useState(false);
  const [leaderboardMessage, setLeaderboardMessage] = useState("");
  const [showPrizeDialog, setShowPrizeDialog] = useState(true); // Auto-vanishing dialog

  const aiMovesRef = useRef(aiMoves);
  aiMovesRef.current = aiMoves;
  const prevBoardRef = useRef(emptyBoard);

  // Total game timer (milliseconds) - only counts player's time, not AI thinking time
  const [totalGameTime, setTotalGameTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const gameStartTimeRef = useRef(null);
  const playerTurnStartRef = useRef(null); // Track when player's turn started

  // AI COMMENTS LIBRARY
  const comments = {
    strongMoves: [
      "Nice placement! That spot has serious potential. 🔥",
      "Ooooh! Smart move there. 🧠✨",
      "You're building pressure, I see you. 😎",
      "That's a clean setup! I like your style. ⚡",
      "You really thought that one through. Respect! 🙌",
      "Okay okay, that's actually pretty good. 👀",
      "You're playing with strategy today! 🔥",
      "Chess vibes from that move. ♟️💡",
      "That position could turn dangerous for me… 👀🌀",
      "I did NOT expect that. Well played. 😮👏"
    ],
    weakMoves: [
      "Interesting… let's see where that goes. 🤔",
      "Bold choice… maybe too bold? 😅",
      "Hehe, that move gave me ideas. 😏⚙️",
      "You're cooking something weird, aren't you? 🧪😄",
      "Not the strongest move, but I respect the creativity. 🎨",
      "Hmm… your strategy is mysterious today. 🕵️‍♂️",
      "Surprising pick! Let's see if it pays off. 🎲",
      "You really went for THAT square? Alright then. 😌",
      "I feel like you just clicked randomly. 😆",
      "That move… is definitely a vibe. 🌈"
    ],
    blocking: [
      "Whoa! Solid block. You saved yourself there. 🛡️🔥",
      "Oof, you shut down my plan. 😤👍",
      "Nice catch! That was a critical block. 🚫🎯",
      "Almost had you… but great block! 😮👏",
      "You're reading my mind now? 😳🧠",
      "Alright strategist, I see you blocking my lines. 😎🛡️",
      "Ugh, you saw the trap. Fine. 😤😄",
      "That block was SPOT ON. 🎯",
      "You stopped my momentum! Respect. 🤝🔥",
      "Wow. You actually blocked the perfect square. 🧠👏"
    ],
    threat: [
      "Uh oh… that's a threat. 👀🔥",
      "Hold on… that line is getting scary. 😳",
      "You're building something dangerous. 🧨",
      "That's a sneaky setup… 😏🕸️",
      "I see a 2-in-a-row forming… not ideal for me. 😬",
      "Whoa, strong threat! Don't get too excited. 😆",
      "That line is looking sharp! ⚡",
      "You're forcing me to play defense now. 🛡️😤",
      "Your pressure is real this turn. 💥",
      "You're setting up a win path, aren't you? 😎🎯"
    ],
    humanVanish: [
      "Your oldest mark vanished… but the new setup looks promising. 🌪️😄",
      "Poof! Your old mark disappeared. Tactical refresh? 🤯🔄",
      "A vanish AND a threat? Impressive. 💨🔥",
      "Your mark vanished, but your plan didn't. 😌🌀",
      "Fresh board, fresh ideas! 🌱😎"
    ],
    aiVanish: [
      "You made one of my marks vanish… rude. 😤💨",
      "HEY—my piece just disappeared! 😭",
      "You forced my oldest mark off the board… clever. 😏🌀",
      "My board control just evaporated… not cool. 😩",
      "I see what you're doing with those vanish timings. 👀⚙️"
    ],
    humanWin: [
      "You got me! GG, that was clean. 🏆🔥",
      "Alright, that's a beautiful win. Respect! 🙌😎",
      "You outplayed me. Nicely done! 👑🎉",
      "What a finish! You earned that one. 🧠✨",
      "Oof… I walked right into that. 💀"
    ],
    aiWin: [
      "Checkmate! Good fight though. 🤝⚡",
      "I win this round. You put up a solid fight. 🏆😌",
      "Sneaky line by me, huh? 😏💫",
      "That's game! Don't worry, you're getting better. 💪😄",
      "Victory is mine! But you kept me on edge. 😳🔥"
    ],
    smug: [
      "You think THAT can beat me? Cute. 😏",
      "Nice try, but I'm three moves ahead. 🧠💫",
      "Your strategy is… entertaining. 😌",
      "I see your plan. I just don't fear it. 😎🔥",
      "Try harder. I like a challenge. 😏⚔️",
      "I predicted that move 5 turns ago. 🤖✨",
      "You're improving, but I'm still in control. 😌⚙️"
    ]
  };

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Analyze the move and return appropriate comment
  const analyzeMove = useCallback((newBoard, moveIndex, prevBoard, prevPlayerMoves, prevAiMoves) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const strongPositions = [4, 0, 2, 6, 8]; // Center and corners

    // Check if player blocked AI's line
    const wasBlocking = lines.some(line => {
      const aiInLine = line.filter(pos => prevBoard[pos] === initialAiMark).length;
      return aiInLine === 2 && line.includes(moveIndex) && prevBoard[moveIndex] === null;
    });

    // Check if player created a threat (2 in a line)
    const createdThreat = lines.some(line => {
      const playerInLine = line.filter(pos => newBoard[pos] === initialPlayerMark).length;
      const emptyInLine = line.filter(pos => newBoard[pos] === null).length;
      return playerInLine === 2 && emptyInLine === 1;
    });

    // Check if vanishing happened
    const playerVanished = prevPlayerMoves.length >= 3;
    const aiVanished = prevAiMoves.length >= 3;

    // Check if it's a strong position
    const isStrongPosition = strongPositions.includes(moveIndex);

    // Random smug comment (20% chance in hard mode)
    if (Math.random() < 0.2) {
      return getRandom(comments.smug);
    }

    // Priority: blocking > threat > vanish > strong/weak
    if (wasBlocking) return getRandom(comments.blocking);
    if (createdThreat) return getRandom(comments.threat);
    if (playerVanished) return getRandom(comments.humanVanish);
    if (aiVanished) return getRandom(comments.aiVanish);
    if (isStrongPosition) return getRandom(comments.strongMoves);

    return getRandom(comments.weakMoves);
  }, [initialPlayerMark, initialAiMark, comments]);

  const handleTimeout = useCallback(() => {
    setAiComment("⏰ Too slow! Time's up!");
    setMessage("Time's up!");
    setGameOver(true);
    setTotalRounds(prev => prev + 1);
    setIsPlayerTurn(false);
    setTimeout(() => setChampionshipOver(true), 1500);
  }, []);

  // Timer effect - SKIP timer for first move
  useEffect(() => {
    if (!gameOver && isPlayerTurn && !pendingAiMove && !isFirstMove && !showRoundStart) {
      if (moveTimer > 0) {
        const timer = setTimeout(() => setMoveTimer(prev => Math.max(0, prev - 0.1)), 100);
        return () => clearTimeout(timer);
      } else {
        handleTimeout();
      }
    }
  }, [moveTimer, gameOver, isPlayerTurn, pendingAiMove, isFirstMove, showRoundStart, handleTimeout]);

  // Dying positions effect
  useEffect(() => {
    const dying = [];
    if (playerMoves.length === 3 && !gameOver) dying.push(playerMoves[0]);
    setDyingPositions(dying);
  }, [playerMoves, gameOver]);

  // Simple continuous game timer - runs from game start to championship over
  useEffect(() => {
    let interval;
    // Timer runs when game is active (not on round start screen, not championship over)
    if (timerRunning && !championshipOver && !showRoundStart) {
      interval = setInterval(() => {
        if (gameStartTimeRef.current) {
          setTotalGameTime(Date.now() - gameStartTimeRef.current);
        }
      }, 10);
    }
    return () => clearInterval(interval);
  }, [timerRunning, championshipOver, showRoundStart]);

  // Auto-hide prize dialog after 3 seconds
  useEffect(() => {
    if (showPrizeDialog) {
      const timer = setTimeout(() => {
        setShowPrizeDialog(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPrizeDialog]);

  // Start timer when first round begins
  useEffect(() => {
    if (!showRoundStart && totalRounds === 0 && !gameStartTimeRef.current) {
      gameStartTimeRef.current = Date.now(); // Store START TIME as timestamp
      setTimerRunning(true);
    }
  }, [showRoundStart, totalRounds]);

  // Reset timer on component mount (handles page reload)
  useEffect(() => {
    gameStartTimeRef.current = null;
    setTotalGameTime(0);
    setTimerRunning(false);
  }, []);


  // Format time as MM:SS.mmm
  const formatGameTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const checkWinner = useCallback((b) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let line of lines) {
      const [a, b1, c] = line;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
    }
    return null;
  }, []);

  const addMove = useCallback((movesArray, index, mark, boardCopy) => {
    boardCopy[index] = mark;
    let newMoves = [...movesArray, index];
    const result = checkWinner(boardCopy);
    if (!result && newMoves.length > 3) {
      const oldest = newMoves.shift();
      boardCopy[oldest] = null;
    }
    return newMoves;
  }, [checkWinner]);

  const handleWinner = useCallback((winner, line) => {
    setWinningLine(line);
    setIsPlayerTurn(false);
    setTimeout(() => {
      if (winner === initialPlayerMark) {
        setAiComment(getRandom(comments.humanWin));
        setRoundsWon(prev => {
          const newRoundsWon = prev + 1;
          if (newRoundsWon === 5) { setMessage("🏆 CHAMPION!"); setChampionshipOver(true); }
          else { setMessage(`Round won! (${newRoundsWon}/5)`); }
          return newRoundsWon;
        });
        setTotalRounds(prev => prev + 1);
      } else {
        setAiComment(getRandom(comments.aiWin));
        setMessage("AI wins!");
        setTotalRounds(prev => prev + 1);
        setTimeout(() => setChampionshipOver(true), 1500);
      }
      setGameOver(true);
    }, 600);
  }, [initialPlayerMark, comments.humanWin, comments.aiWin]);

  // AI Move function
  const makeAiMove = useCallback(async (currentBoard, currentAiMoves) => {
    setAiComment("🤖 Let me think...");
    setPendingAiMove(true);

    try {
      const response = await axios.post(`${API_URL}/api/game/aiMove`, {
        board: currentBoard,
        currentPlayer: initialAiMark,
        difficulty: "hard",
        playerMoves: playerMoves,
        aiMoves: currentAiMoves,
      });

      const aiMoveIndex = response.data.moveIndex;
      const moveMade = response.data.moveMade;

      if (moveMade && aiMoveIndex !== -1) {
        setTimeout(() => {
          let boardCopy = [...currentBoard];
          const newAiMoves = addMove(currentAiMoves, aiMoveIndex, initialAiMark, boardCopy);
          setBoard(boardCopy);
          setAiMoves(newAiMoves);
          prevBoardRef.current = boardCopy;

          const aiResult = checkWinner(boardCopy);
          if (aiResult) {
            handleWinner(aiResult.winner, aiResult.line);
          } else {
            setCurrentPlayer(initialPlayerMark);
            setIsPlayerTurn(true);
            setMoveTimer(1.5);
            setAiComment("⚡ Your turn! Make your move!");
          }
          setPendingAiMove(false);
        }, 400);
      } else {
        setCurrentPlayer(initialPlayerMark);
        setIsPlayerTurn(true);
        setMoveTimer(1.5);
        setAiComment("⚡ Your turn!");
        setPendingAiMove(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setCurrentPlayer(initialPlayerMark);
      setIsPlayerTurn(true);
      setMoveTimer(1.5);
      setAiComment("⚠️ Connection issue - your turn!");
      setPendingAiMove(false);
    }
  }, [initialAiMark, initialPlayerMark, playerMoves, addMove, checkWinner, handleWinner]);

  // AI First Move trigger
  useEffect(() => {
    const isBoardEmpty = board.every(cell => cell === null);
    const isAiTurn = currentPlayer === initialAiMark;

    if (isBoardEmpty && isAiTurn && !gameOver && !pendingAiMove && !showRoundStart) {
      setAiComment("🤖 I'll go first! Watch and learn...");
      makeAiMove(board, []);
    }
  }, [board, currentPlayer, initialAiMark, gameOver, pendingAiMove, showRoundStart, makeAiMove]);

  // Initial setup
  useEffect(() => {
    const randomStart = Math.random() < 0.5;
    if (randomStart) {
      setRoundStarter("ai");
      setCurrentPlayer(initialAiMark);
      setIsPlayerTurn(false);
    } else {
      setRoundStarter("player");
      setCurrentPlayer(initialPlayerMark);
      setIsPlayerTurn(true);
    }
    setShowRoundStart(true);
    setIsFirstMove(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRound = () => {
    setShowRoundStart(false);
    if (roundStarter === "player") {
      setAiComment("⚡ You start! No timer for your first move. Take your time!");
    } else {
      setAiComment("🤖 I'll make the first move!");
    }
  };

  const handleCellClick = async (index) => {
    if (board[index] || currentPlayer !== initialPlayerMark || gameOver || !isPlayerTurn || pendingAiMove || showRoundStart) return;

    const wasFirstMove = isFirstMove;
    if (wasFirstMove) {
      setIsFirstMove(false);
    }

    setMoveTimer(1.5);

    let newBoard = [...board];
    const prevPlayerMoves = [...playerMoves];
    const prevAiMovesCopy = [...aiMoves];
    const newPlayerMoves = addMove(playerMoves, index, initialPlayerMark, newBoard);
    setBoard(newBoard);
    setPlayerMoves(newPlayerMoves);

    // Analyze move and set AI comment
    const comment = analyzeMove(newBoard, index, prevBoardRef.current, prevPlayerMoves, prevAiMovesCopy);
    setAiComment(comment);
    prevBoardRef.current = [...newBoard];

    const result = checkWinner(newBoard);
    if (result) { handleWinner(result.winner, result.line); return; }

    setCurrentPlayer(initialAiMark);
    setIsPlayerTurn(false);

    // Small delay before AI responds
    setTimeout(() => {
      makeAiMove(newBoard, aiMovesRef.current);
    }, 800);
  };

  const nextRound = () => {
    setBoard(emptyBoard);
    setWinningLine([]);
    setPlayerMoves([]);
    setAiMoves([]);
    setDyingPositions([]);
    setGameOver(false);
    setPendingAiMove(false);
    setIsFirstMove(true);
    prevBoardRef.current = emptyBoard;

    const randomStart = Math.random() < 0.5;
    if (randomStart) {
      setRoundStarter("ai");
      setCurrentPlayer(initialAiMark);
      setIsPlayerTurn(false);
    } else {
      setRoundStarter("player");
      setCurrentPlayer(initialPlayerMark);
      setIsPlayerTurn(true);
    }
    setShowRoundStart(true);
  };

  const restartChampionship = () => {
    setBoard(emptyBoard);
    setWinningLine([]);
    setPlayerMoves([]);
    setAiMoves([]);
    setDyingPositions([]);
    setGameOver(false);
    setRoundsWon(0);
    setTotalRounds(0);
    setChampionshipOver(false);
    setPendingAiMove(false);
    setIsFirstMove(true);
    prevBoardRef.current = emptyBoard;

    // Reset game timer
    setTotalGameTime(0);
    setTimerRunning(false);
    gameStartTimeRef.current = null;

    const randomStart = Math.random() < 0.5;
    if (randomStart) {
      setRoundStarter("ai");
      setCurrentPlayer(initialAiMark);
      setIsPlayerTurn(false);
    } else {
      setRoundStarter("player");
      setCurrentPlayer(initialPlayerMark);
      setIsPlayerTurn(true);
    }
    setShowRoundStart(true);
  };

  const timerPercentage = (moveTimer / 1.5) * 100;

  // Round Start Screen
  if (showRoundStart) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}>
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(30, 41, 59, 0.9)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#60a5fa', marginBottom: '20px' }}>⚔️ Round {totalRounds + 1}</h2>

          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
            {roundStarter === "player" ? "👤" : "🤖"}
          </div>

          <p style={{ fontSize: '1.3rem', color: roundStarter === "player" ? '#4ade80' : '#f87171', marginBottom: '10px', fontWeight: 'bold' }}>
            {roundStarter === "player" ? "You Start First!" : "AI Starts First!"}
          </p>

          <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '15px' }}>
            {roundStarter === "player"
              ? "No timer for your first move. Take your time! ⏱️❌"
              : "Watch the AI's opening move carefully! 👀"}
          </p>

          {/* Prize Info */}
          <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 'bold', margin: 0 }}>
              🎁 Win 5 rounds to join the leaderboard! Top 2 win exciting prizes every month! 🏆
            </p>
          </div>

          <button
            onClick={() => { playSound('buttonClick'); startRound(); }}
            style={{ padding: '15px 40px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            🚀 Start Round
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'white' }}>
      <Helmet>
        <title>Endless Tic-Tac-Toe | Challenge AI</title>
        <meta name="description" content="Challenge our smart AI in Endless Tic-Tac-Toe! Win 5 rounds to become Champion and join the global leaderboard." />
      </Helmet>

      {/* Floating Prize Dialog - Auto vanishes after 3 seconds */}
      {showPrizeDialog && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(236, 72, 153, 0.95))',
          padding: '15px 25px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(168, 85, 247, 0.4)',
          animation: 'slideDown 0.5s ease-out',
          maxWidth: '350px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
            🎁 Win 5 rounds for Leaderboard!
          </p>
          <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
            Top 2 players win exciting prizes every month! 🏆
          </p>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px', padding: '12px 25px', background: 'rgba(30, 41, 59, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '350px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#60a5fa' }}>⚔️ CHAMPIONSHIP</h2>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24' }}>🏆 {roundsWon}/5</div>
        <div style={{ fontSize: '0.85rem', color: '#a78bfa', marginTop: '5px', fontFamily: 'monospace' }}>⏱️ {formatGameTime(totalGameTime)}</div>
      </div>

      {/* AI Comment Box */}
      <div style={{ marginBottom: '10px', padding: '12px 20px', background: 'rgba(30, 41, 59, 0.95)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', width: '100%', maxWidth: '350px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#e2e8f0', textAlign: 'center', lineHeight: 1.4 }}>
          {aiComment || "🤖 Ready to play!"}
        </p>
      </div>

      {/* Timer Section - Fixed Height */}
      <div style={{ height: '50px', marginBottom: '10px', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {!gameOver && isPlayerTurn && !pendingAiMove && !isFirstMove && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '1.2rem', color: moveTimer <= 0.5 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>⏱️ {moveTimer.toFixed(1)}s</span>
            <div style={{ width: '100%', height: '5px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden', marginTop: '5px' }}>
              <div style={{ width: `${timerPercentage}%`, height: '100%', background: moveTimer <= 0.5 ? '#ef4444' : '#22c55e', borderRadius: '3px', transition: 'width 0.1s linear' }} />
            </div>
          </div>
        )}
        {!gameOver && isPlayerTurn && isFirstMove && (
          <div style={{ padding: '8px 16px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '8px', fontSize: '0.9rem', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}>⏱️ No timer - First move!</div>
        )}
        {!gameOver && (!isPlayerTurn || pendingAiMove) && (
          <div style={{ padding: '8px 16px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>🤖 AI's turn...</div>
        )}
        {gameOver && (
          <div style={{ padding: '8px 16px', background: 'rgba(250, 204, 21, 0.2)', borderRadius: '8px', fontSize: '0.9rem', color: '#fbbf24' }}>🏁 Round Over</div>
        )}
      </div>

      {/* Game Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 90px)', gridTemplateRows: 'repeat(3, 90px)', gap: '8px', padding: '15px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '15px' }}>
        {board.map((cell, index) => {
          const isWinningCell = winningLine.includes(index);
          const isDying = dyingPositions.includes(index);
          const isX = cell === "X";
          const isO = cell === "O";
          return (
            <div key={index} onClick={() => handleCellClick(index)}
              style={{ width: '90px', height: '90px', background: isWinningCell ? 'rgba(250, 204, 21, 0.2)' : 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 'bold', cursor: cell || gameOver || !isPlayerTurn ? 'default' : 'pointer', transition: 'all 0.2s ease', position: 'relative', border: isWinningCell ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.05)', color: isX ? '#ef4444' : isO ? '#3b82f6' : 'white', textShadow: isX ? '0 0 15px rgba(239, 68, 68, 0.6)' : isO ? '0 0 15px rgba(59, 130, 246, 0.6)' : 'none' }}>
              {cell}
              {isDying && cell && (
                <span style={{ position: 'absolute', top: '4px', right: '8px', color: '#fbbf24', fontSize: '1.2rem', fontWeight: 'bold', animation: 'blink 0.5s infinite', textShadow: '0 0 8px rgba(250, 204, 21, 0.8)' }}>!</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Quit Button */}
      {!gameOver && (
        <button onClick={() => { playSound('buttonClick'); setShowQuitConfirm(true); }} style={{ padding: '10px 25px', background: 'rgba(71, 85, 105, 0.8)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>Quit</button>
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001 }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.95)', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '350px', width: '90%' }}>
            <h2 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#f87171' }}>⚠️ Quit Game?</h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '20px', color: '#e2e8f0' }}>Are you sure you want to quit? Your progress will be lost.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => { playSound('buttonClick'); onQuit(); }} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Yes, Quit</button>
              <button onClick={() => { playSound('buttonClick'); setShowQuitConfirm(false); }} style={{ padding: '12px 20px', background: 'rgba(71, 85, 105, 0.8)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>Continue Playing</button>
            </div>
          </div>
        </div>
      )}

      {/* Championship Over Modal */}
      {championshipOver && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          {/* Winner - Show Leaderboard Form or Display */}
          {roundsWon === 5 ? (
            showLeaderboardDisplay ? (
              <div className="flex flex-col items-center gap-4">
                {/* Show submission message if exists */}
                {leaderboardMessage && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 max-w-md text-center animate-victory-burst">
                    <p className="text-green-400 font-medium">{leaderboardMessage}</p>
                  </div>
                )}
                <LeaderboardDisplay onClose={() => {
                  setShowLeaderboardDisplay(false);
                  setShowLeaderboardForm(false);
                  setLeaderboardMessage("");
                }} />
                <div className="flex gap-3">
                  <button onClick={() => { playSound('buttonClick'); restartChampionship(); setShowLeaderboardForm(false); setShowLeaderboardDisplay(false); }} className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform">🔄 Play Again</button>
                  <button onClick={() => { playSound('buttonClick'); onQuit(); }} className="px-5 py-3 bg-slate-700/80 text-slate-200 font-medium rounded-xl border border-slate-600/50 hover:bg-slate-600/80 transition-colors">Menu</button>
                </div>
              </div>
            ) : showLeaderboardForm ? (
              <div className="flex flex-col items-center gap-4">
                <LeaderboardForm
                  timeTakenMs={totalGameTime}
                  onSubmitSuccess={(message) => {
                    setLeaderboardMessage(message || "");
                    setShowLeaderboardForm(false);
                    setShowLeaderboardDisplay(true);
                  }}
                />
                <button onClick={() => { playSound('buttonClick'); setShowLeaderboardForm(false); setShowLeaderboardDisplay(true); }} className="text-slate-400 text-sm hover:text-slate-300 transition-colors underline">Skip and view leaderboard</button>
              </div>
            ) : (
              <div style={{ background: 'rgba(30, 41, 59, 0.95)', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '380px', width: '90%' }}>
                <h2 style={{ marginBottom: '15px', fontSize: '1.8rem', color: '#fbbf24' }}>🏆 CHAMPION!</h2>
                <p style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#e2e8f0' }}>{aiComment}</p>
                <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: '#94a3b8' }}>Rounds: {totalRounds} | Wins: {roundsWon}</p>
                <p style={{ fontSize: '1rem', marginBottom: '15px', color: '#a78bfa', fontFamily: 'monospace', fontWeight: 'bold' }}>⏱️ Total Time: {formatGameTime(totalGameTime)}</p>

                {/* Prize Banner */}
                <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))', padding: '12px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 'bold', margin: 0 }}>🎁 Top 2 players win exciting prizes every month! 🎁</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => { playSound('buttonClick'); setShowLeaderboardForm(true); }} style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #ef4444, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>🏆 Join Leaderboard & Win!</button>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => { playSound('buttonClick'); restartChampionship(); }} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 Retry</button>
                    <button onClick={() => { playSound('buttonClick'); onQuit(); }} style={{ padding: '12px 20px', background: 'rgba(71, 85, 105, 0.8)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>Menu</button>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Defeated */
            <div style={{ background: 'rgba(30, 41, 59, 0.95)', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '350px', width: '90%' }}>
              <h2 style={{ marginBottom: '15px', fontSize: '1.8rem', color: '#ef4444' }}>💀 DEFEATED</h2>
              <p style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#e2e8f0' }}>{aiComment}</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: '#94a3b8' }}>Rounds: {totalRounds} | Wins: {roundsWon}</p>
              <p style={{ fontSize: '1rem', marginBottom: '20px', color: '#a78bfa', fontFamily: 'monospace', fontWeight: 'bold' }}>⏱️ Total Time: {formatGameTime(totalGameTime)}</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => { playSound('buttonClick'); restartChampionship(); }} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 Retry</button>
                <button onClick={() => { playSound('buttonClick'); onQuit(); }} style={{ padding: '12px 20px', background: 'rgba(71, 85, 105, 0.8)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>Menu</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Round Over Modal */}
      {gameOver && !championshipOver && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.95)', padding: '25px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '320px', width: '90%' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px', color: message.includes('won') ? '#4ade80' : '#f87171' }}>{message}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: '#e2e8f0' }}>{aiComment}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => { playSound('buttonClick'); nextRound(); }} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Next →</button>
              <button onClick={() => { playSound('buttonClick'); setShowQuitConfirm(true); }} style={{ padding: '12px 20px', background: 'rgba(71, 85, 105, 0.8)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>Quit</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}

export default AIgame;