import React, { useState } from "react";

function RulesScreen({ onStart }) {
  const [level, setLevel] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-slate-700/50">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Game Rules
        </h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-red-500">●</span>
              Endless Gameplay
            </h3>
            <p className="text-slate-300 leading-relaxed">
              This is an "endless" Tic Tac Toe where marks can be replaced. Each player can have a maximum of 3 marks on the board at once.
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-blue-500">●</span>
              Mark Replacement
            </h3>
            <p className="text-slate-300 leading-relaxed">
              When a player places their 4th mark, their oldest mark is automatically removed from the board.
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-green-500">●</span>
              Winning Condition
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The first player to get 3 marks in a row, column, or diagonal wins the game!
            </p>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-3 text-center">
            Select AI Difficulty Level
          </label>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  level === lvl
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 scale-105"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/30"
                }`}
              >
                {lvl === 1 ? "Easy" : lvl === 2 ? "Medium" : "Hard"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(level)}
          className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default RulesScreen;
