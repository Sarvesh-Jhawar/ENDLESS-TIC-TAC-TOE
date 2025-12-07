import React from "react";
import { useSound } from "../contexts/SoundContext";
import { useNavigate } from "react-router-dom";

function RulesScreen({ onStart }) {
  const navigate = useNavigate();
  const { playSound } = useSound();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '20px'
    }}>
      {/* Home Button */}
      <button onClick={() => { playSound('buttonClick'); navigate('/'); }} style={{ position: 'fixed', top: '20px', left: '20px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(71, 85, 105, 0.9)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', zIndex: 9999, backdropFilter: 'blur(10px)', fontWeight: 'bold' }}> Home</button>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '8px',
          color: '#60a5fa'
        }}>
          ⚔️ CHAMPIONSHIP MODE
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#94a3b8',
          marginBottom: '20px'
        }}>
          Beat the AI 5 times to become champion!
        </p>

        {/* Quick Rules */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '1.1rem' }}>🎮</span>
            <span style={{ marginLeft: '10px', fontSize: '0.95rem' }}>3 marks max per player — oldest vanishes!</span>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '1.1rem' }}>⏱️</span>
            <span style={{ marginLeft: '10px', fontSize: '0.95rem' }}>1.5 seconds per move</span>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '1.1rem' }}>🏆</span>
            <span style={{ marginLeft: '10px', fontSize: '0.95rem' }}>Win 5 rounds = Champion</span>
          </div>
          <div>
            <span style={{ fontSize: '1.1rem' }}>💀</span>
            <span style={{ marginLeft: '10px', fontSize: '0.95rem' }}>AI wins once = Game Over</span>
          </div>
        </div>

        {/* Tip */}
        <div style={{
          background: 'rgba(250, 204, 21, 0.1)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '25px',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          fontSize: '0.85rem',
          color: '#fbbf24'
        }}>
          💡 Watch the "!" on your oldest piece
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart()}
          style={{
            width: '100%',
            fontSize: '1.2rem',
            padding: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
          }}
        >
          🚀 Start Championship
        </button>
      </div>
    </div>
  );
}

export default RulesScreen;