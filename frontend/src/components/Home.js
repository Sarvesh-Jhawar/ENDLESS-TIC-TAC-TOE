import React from "react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";

function Home() {
  const navigate = useNavigate();

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

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-blue-500/5 animate-gradient pointer-events-none" />

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
            onClick={() => navigate("/local")}
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
            onClick={() => navigate("/ai")}
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

        {/* Bottom decoration */}
        <div className="mt-16 flex justify-center gap-3">
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

