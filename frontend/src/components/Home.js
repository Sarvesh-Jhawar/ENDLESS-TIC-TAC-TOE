import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ParticleBackground from "./ParticleBackground";
import SoundButton from "./SoundButton";
import { useSound } from "../contexts/SoundContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function Home() {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isConnectingToAI, setIsConnectingToAI] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionMessage, setConnectionMessage] = useState("Waking up AI...");

  // Show rules modal first
  const handleChallengeAI = () => {
    playSound('buttonClick');
    setShowRulesModal(true);
  };

  // Start connecting after reading rules
  const handleStartGame = () => {
    playSound('buttonClick');
    setShowRulesModal(false);
    connectToAI();
  };



  // Connect to AI with warmup request
  const connectToAI = async () => {
    setIsConnectingToAI(true);
    setConnectionProgress(0);
    setConnectionMessage("Waking up AI...");

    // Start progress animation
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 90) return prev; // Cap at 90% until actual response
        return prev + Math.random() * 5;
      });
    }, 500);

    // Update messages based on progress
    const messageInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev < 20) setConnectionMessage("🌐 Connecting to server...");
        else if (prev < 40) setConnectionMessage("🔌 Establishing connection...");
        else if (prev < 60) setConnectionMessage("🤖 Waking up AI...");
        else if (prev < 80) setConnectionMessage("⚡ Almost ready...");
        else setConnectionMessage("🎯 Initializing game...");
        return prev;
      });
    }, 1000);

    try {
      await axios.get(`${API_URL}/api/game/ready`);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setConnectionProgress(100);
      setConnectionMessage("✅ AI is ready! Starting game...");

      // Small delay to show success message
      setTimeout(() => {
        setIsConnectingToAI(false);
        navigate("/ai");
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      // Still navigate even if warmup fails - game might work
      setConnectionProgress(100);
      setConnectionMessage("⚠️ Connecting... (may take a moment)");
      setTimeout(() => {
        setIsConnectingToAI(false);
        navigate("/ai");
      }, 1000);
    }
  };

  // Floating symbols data
  const floatingSymbols = [
    { symbol: 'X', x: '10%', y: '20%', size: '4rem', delay: '0s', color: 'text-red-500/20' },
    { symbol: 'O', x: '85%', y: '15%', size: '5rem', delay: '1s', color: 'text-blue-500/20' },
    { symbol: 'X', x: '75%', y: '70%', size: '3rem', delay: '2s', color: 'text-pink-500/20' },
    { symbol: 'O', x: '15%', y: '75%', size: '4.5rem', delay: '0.5s', color: 'text-purple-500/20' },
    { symbol: 'X', x: '50%', y: '85%', size: '3.5rem', delay: '1.5s', color: 'text-red-500/15' },
    { symbol: 'O', x: '90%', y: '45%', size: '2.5rem', delay: '2.5s', color: 'text-blue-500/15' },
    { symbol: 'X', x: '5%', y: '50%', size: '3rem', delay: '3s', color: 'text-pink-500/15' },
    { symbol: 'O', x: '40%', y: '10%', size: '2rem', delay: '0.8s', color: 'text-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleColor="mixed" />

      {/* Sound Button */}
      <SoundButton />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-blue-500/5 animate-gradient pointer-events-none" />

      {/* AI Connection Loading Overlay */}
      {isConnectingToAI && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="text-center space-y-8 p-8 max-w-md">
            {/* Animated AI Icon */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center animate-pulse">
                <span className="text-6xl">🤖</span>
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-blue-500/30 animate-ping" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Connecting to AI</h2>
              <p className="text-slate-400 text-sm">First request may take ~50 seconds on free tier</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${connectionProgress}%` }}
              />
            </div>

            {/* Progress Text */}
            <div className="space-y-2">
              <p className="text-xl text-blue-400 font-medium animate-pulse">{connectionMessage}</p>
              <p className="text-slate-500 text-sm">{Math.round(connectionProgress)}% complete</p>
            </div>

            {/* Tips */}
            <div className="text-slate-500 text-xs bg-slate-900/50 rounded-lg p-4">
              💡 Tip: The AI runs on a free server that sleeps after inactivity.
              It wakes up on first request!
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl animate-victory-burst">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🤖</div>
              <h2 className="text-2xl font-bold text-white mb-1">Challenge AI</h2>
              <p className="text-slate-400 text-sm">Beat the AI 5 times to become Champion!</p>
            </div>

            {/* Game Rules */}
            <div className="space-y-3 mb-6">
              <h3 className="text-blue-400 font-semibold flex items-center gap-2">
                <span>📋</span> How to Play
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Get 3 in a row (horizontal, vertical, or diagonal) to win a round</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">⚡</span>
                  <span><strong>Twist:</strong> Each player can only have 3 marks on the board</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🔄</span>
                  <span>Your 4th mark causes your oldest mark to vanish!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">⏰</span>
                  <span>You have 1.5 seconds per move (first move has no timer)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">🏆</span>
                  <span>Win 5 rounds to become Champion and join the Leaderboard!</span>
                </li>
              </ul>
            </div>

            {/* Prize Info */}
            <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 rounded-xl p-3 mb-6 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                <span>🎁</span> Top 2 Champions win prizes every month! <span>🏆</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { playSound('buttonClick'); setShowRulesModal(false); }}
                className="flex-1 py-3 bg-slate-700/80 text-slate-300 font-medium rounded-xl border border-slate-600/50 hover:bg-slate-600/80 transition-all duration-200"
              >
                ← Back
              </button>
              <button
                onClick={handleStartGame}
                onMouseEnter={() => playSound('hover')}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200"
              >
                🚀 Start Game
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Floating X and O symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingSymbols.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.color} font-bold animate-float-slow`}
            style={{
              left: item.x,
              top: item.y,
              fontSize: item.size,
              animationDelay: item.delay,
              textShadow: item.symbol === 'X'
                ? '0 0 30px rgba(239, 68, 68, 0.3)'
                : '0 0 30px rgba(59, 130, 246, 0.3)',
            }}
          >
            {item.symbol}
          </div>
        ))}
      </div>

      {/* Animated glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Grid decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Title */}
        <div className="mb-12 space-y-4">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-2">
            <span className="block drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] animate-text-glow">Endless</span>
            <span className="block bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Tic Tac Toe
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 font-light tracking-wide">
            A modern twist on a classic game
          </p>

          {/* Decorative line */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500/50"></div>
          </div>
        </div>

        {/* Game mode preview - Tic Tac Toe grid */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 gap-2 p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-300 hover:bg-slate-600/50 hover:scale-110"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {i === 0 && <span className="text-red-500 animate-neon-pulse">X</span>}
                {i === 4 && <span className="text-blue-500 animate-neon-pulse">O</span>}
                {i === 8 && <span className="text-red-500 animate-neon-pulse">X</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => { playSound('buttonClick'); navigate("/local"); }}
            onMouseEnter={() => playSound('hover')}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 w-full sm:w-auto min-w-[220px] overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-lg">Play with Friend</span>
            </span>

            {/* Glow border */}
            <div className="absolute inset-0 rounded-xl border-2 border-red-400/0 group-hover:border-red-400/50 transition-all duration-300"></div>
          </button>

          <button
            onClick={handleChallengeAI}
            onMouseEnter={() => playSound('hover')}
            className="group relative px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 backdrop-blur-sm border-2 border-blue-500/50 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 w-full sm:w-auto min-w-[220px] overflow-hidden shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-lg">Challenge AI</span>
            </span>
          </button>
        </div>

        {/* Leaderboard Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => { playSound('buttonClick'); navigate("/leaderboard"); }}
            onMouseEnter={() => playSound('hover')}
            className="group relative px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-500/40 text-yellow-400 font-medium rounded-xl hover:bg-yellow-500/20 hover:border-yellow-400 hover:text-yellow-300 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 overflow-hidden shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/30"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-xl">🏆</span>
              <span>View Leaderboard</span>
            </span>
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="mt-12 flex justify-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce shadow-lg shadow-red-500/50"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-150 shadow-lg shadow-pink-500/50"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300 shadow-lg shadow-blue-500/50"></div>
        </div>

        {/* Version badge */}
        <div className="mt-8 flex justify-center">
          <span className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/50">
            v2.0 • Enhanced Edition
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;

