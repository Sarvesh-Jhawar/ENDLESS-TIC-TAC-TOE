import React, { useState, useEffect } from "react";

function CountdownScreen({ startGame }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      startGame();
    }
  }, [countdown, startGame]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: 'white'
    }}>
      <h1 style={{
        fontSize: '1.8rem',
        marginBottom: '30px',
        color: '#60a5fa'
      }}>
        ⚔️ GET READY ⚔️
      </h1>

      <div style={{
        fontSize: '8rem',
        fontWeight: 'bold',
        animation: 'countdownPulse 1s ease-in-out infinite',
        textShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
        marginBottom: '30px',
        color: '#3b82f6'
      }}>
        {countdown === 0 ? "GO!" : countdown}
      </div>

      <div style={{
        fontSize: '1rem',
        textAlign: 'center',
        padding: '15px 25px',
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#94a3b8'
      }}>
        ⏱️ 1.5 sec per move • 💀 One AI win = Game Over
      </div>

      <style>
        {`
          @keyframes countdownPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </div>
  );
}

export default CountdownScreen;