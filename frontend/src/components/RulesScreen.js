import React from "react";
import "../styles/game.css";

function RulesScreen({ onStart }) {
  return (
    <div style={{
      maxWidth: '700px',
      margin: '50px auto',
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      color: 'white'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        marginBottom: '10px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        ⚔️ ENDLESS TIC-TAC-TOE ⚔️
      </h1>
      <h2 style={{ 
        textAlign: 'center', 
        fontSize: '1.3rem', 
        marginBottom: '30px',
        opacity: '0.9',
        fontWeight: 'normal'
      }}>
        CHAMPIONSHIP MODE
      </h2>

      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '25px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#ffd700' }}>
          🎯 THE CHALLENGE
        </h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '15px' }}>
          Face the <strong>unbeatable AI</strong> in an ultimate test of speed and strategy. 
          This is not your typical tic-tac-toe — pieces vanish, time is against you, and one mistake means defeat!
        </p>
        <div style={{
          background: 'rgba(255,68,68,0.3)',
          padding: '15px',
          borderRadius: '10px',
          border: '2px solid #ff4444',
          marginTop: '15px'
        }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
            ⚠️ Win 5 rounds to become CHAMPION<br/>
            💀 If AI wins ANY round = GAME OVER
          </p>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '25px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#ffd700' }}>
          📜 THE RULES
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#4CAF50' }}>
            🎲 Basic Gameplay
          </h4>
          <ul style={{ fontSize: '1rem', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Standard 3x3 grid, get 3 in a row to win</li>
            <li>You play against the AI's maximum difficulty</li>
            <li>Each round winner is decided by first to complete a line</li>
          </ul>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ff6b6b' }}>
            ⚡ THE VANISHING TWIST
          </h4>
          <ul style={{ fontSize: '1rem', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Each player can only have <strong>3 pieces</strong> on the board at once</li>
            <li>When you place your <strong>4th piece</strong>, your <strong>oldest piece vanishes</strong></li>
            <li><strong>Exception:</strong> If your 4th piece creates a winning line, you win immediately (no vanishing)</li>
            <li>Yellow <strong>"!"</strong> indicator shows which of YOUR pieces will vanish next</li>
            <li>You must track AI's oldest piece yourself — no hints!</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(255,215,0,0.2)',
          padding: '15px',
          borderRadius: '10px',
          border: '2px solid #ffd700',
          marginTop: '15px'
        }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffd700' }}>
            ⏱️ TIME PRESSURE
          </h4>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', margin: 0 }}>
            <strong>You have only 2 SECONDS per move!</strong><br/>
            ⚠️ Time runs out = You lose the round<br/>
            🤖 AI has unlimited time (because it's a computer)
          </p>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '25px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#ffd700' }}>
          🏆 VICTORY CONDITIONS
        </h3>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p>✅ <strong>YOU WIN:</strong> Defeat the AI in 5 separate rounds</p>
          <p>❌ <strong>YOU LOSE:</strong> AI wins ANY single round OR you run out of time</p>
          <p style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '8px',
            fontStyle: 'italic'
          }}>
            "In Championship Mode, perfection is the only path to victory."
          </p>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.15)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#ffd700' }}>
          💡 PRO TIPS
        </h3>
        <ul style={{ fontSize: '1rem', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Watch the yellow "!" on your oldest piece</li>
          <li>Center and corners are strategic positions</li>
          <li>Think two moves ahead — where will pieces vanish?</li>
          <li>Speed matters, but accuracy matters more</li>
          <li>The AI is mathematically perfect — find its patterns!</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => onStart()}
          style={{
            fontSize: '1.5rem',
            padding: '20px 60px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
          }}
        >
          🔥 Begin Championship 🔥
        </button>
        <p style={{ 
          marginTop: '20px', 
          fontSize: '0.9rem', 
          opacity: '0.8',
          fontStyle: 'italic'
        }}>
          Are you ready to face the ultimate challenge?
        </p>
      </div>
    </div>
  );
}

export default RulesScreen;