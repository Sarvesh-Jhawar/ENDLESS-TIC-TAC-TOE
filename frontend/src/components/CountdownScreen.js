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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '30px',
        textShadow: '3px 3px 6px rgba(0,0,0,0.3)'
      }}>
        ⚔️ CHAMPIONSHIP MODE ⚔️
      </h1>
      
      <div style={{
        fontSize: '10rem',
        fontWeight: 'bold',
        animation: 'pulse 1s ease-in-out infinite',
        textShadow: '5px 5px 15px rgba(0,0,0,0.5)',
        marginBottom: '30px'
      }}>
        {countdown === 0 ? "GO!" : countdown}
      </div>
      
      <div style={{
        fontSize: '1.5rem',
        textAlign: 'center',
        maxWidth: '600px',
        padding: '20px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#ffd700' }}>
          🏆 Win 5 Rounds to Become Champion
        </p>
        <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#ff6b6b' }}>
          💀 AI Wins Once = Game Over
        </p>
        <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#4CAF50' }}>
          ⏱️ 2 Seconds Per Move
        </p>
      </div>

      <style>
        {`
          @keyframes pulse {
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