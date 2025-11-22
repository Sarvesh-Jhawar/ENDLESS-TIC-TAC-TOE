import React, { useState } from "react";
import RulesScreen from "./RulesScreen";
import CountdownScreen from "./CountdownScreen";
import AIgame from "./AIgame"; // Your existing game board

const AIgameWrapper = () => {
  const [screen, setScreen] = useState("rules"); // rules, countdown, game
  const [playerMark, setPlayerMark] = useState("X");
  const [aiMark, setAiMark] = useState("O");
  const [level, setLevel] = useState(1);

  const startCountdown = (selectedLevel) => {
    // Randomly assign X/O
    const marks = ["X", "O"];
    const randomPlayer = marks[Math.floor(Math.random() * 2)];
    setPlayerMark(randomPlayer);
    setAiMark(randomPlayer === "X" ? "O" : "X");
    if (selectedLevel) setLevel(selectedLevel);
    setScreen("countdown");
  };

  const startGame = () => {
    setScreen("game");
  };

  return (
    <>
      {screen === "rules" && <RulesScreen onStart={startCountdown} />}
      {screen === "countdown" && <CountdownScreen startGame={startGame} />}
      {screen === "game" && (
        <AIgame
          playerMark={playerMark}
          aiMark={aiMark}
          level={level}
          setLevel={setLevel} 
          // allow game to update level
           onQuit={() => setScreen("rules")}
        />
      )}
    </>
  );
};

export default AIgameWrapper;
