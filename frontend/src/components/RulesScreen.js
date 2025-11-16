import React from "react";

const RulesScreen = ({ onStart }) => {
  return (
    <div className="game-container rules-container">
      <h2>Game Rules</h2>
      <ul>
        <li>The game has 3 levels: Easy, Medium, and Insane.</li>
        <li>You have 2 lives to complete all levels.</li>
        <li>Each level has a countdown timer; if you miss your turn, it will automatically switch to the AI.</li>
        <li>Clear all levels to win exciting rewards!</li>
        <li>X and O are assigned randomly for a fair start.</li>
      </ul>
      <button className="btn btn-start" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
};

export default RulesScreen;
