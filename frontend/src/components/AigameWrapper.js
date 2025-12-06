import React, { useState } from "react";
import RulesScreen from "./RulesScreen";
import CountdownScreen from "./CountdownScreen";
import AIgame from "./AIgame";

const AIgameWrapper = () => {
  const [screen, setScreen] = useState("rules"); // rules, countdown, game
  const [playerMark, setPlayerMark] = useState("X");
  const [aiMark, setAiMark] = useState("O");

  const startCountdown = () => {
    // Randomly assign X/O for first round
    const marks = ["X", "O"];
    const randomPlayer = marks[Math.floor(Math.random() * 2)];
    setPlayerMark(randomPlayer);
    setAiMark(randomPlayer === "X" ? "O" : "X");
    setScreen("countdown");
  };

  const startGame = () => {
    setScreen("game");
  };

  const quitToMenu = () => {
    setScreen("rules");
  };

  return (
    <>
      {screen === "rules" && <RulesScreen onStart={startCountdown} />}
      {screen === "countdown" && <CountdownScreen startGame={startGame} />}
      {screen === "game" && (
        <AIgame
          playerMark={playerMark}
          aiMark={aiMark}
          onQuit={quitToMenu}
        />
      )}
    </>
  );
};

export default AIgameWrapper;