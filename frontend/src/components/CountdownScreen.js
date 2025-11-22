import React, { useState, useEffect } from "react";

function CountdownScreen({ startGame }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => startGame(), 500);
    }
  }, [countdown, startGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        {countdown > 0 ? (
          <div className="text-9xl sm:text-[12rem] font-bold text-white animate-pulse">
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
              {countdown}
            </div>
          </div>
        ) : (
          <div className="text-4xl sm:text-5xl font-bold text-white animate-bounce">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Let's Play!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountdownScreen;
