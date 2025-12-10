import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import axios from "axios";
import ParticleBackground from "./ParticleBackground";
import SoundButton from "./SoundButton";
import { useSound } from "../contexts/SoundContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function LeaderboardPage() {
    const navigate = useNavigate();
    const { playSound } = useSound();
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/leaderboard/all`);
            setLeaderboard(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            setError("Failed to load leaderboard. Make sure the server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    // Format time as MM:SS.mmm
    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    };

    // Format relative date (e.g., "5 days ago")
    const formatRelativeDate = (dateString) => {
        if (!dateString) return "Just now";

        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
        } else if (diffInHours > 0) {
            return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
        } else if (diffInMinutes > 0) {
            return diffInMinutes === 1 ? "1 min ago" : `${diffInMinutes} mins ago`;
        } else {
            return "Just now";
        }
    };

    // Get rank styling
    const getRankStyle = (rank) => {
        switch (rank) {
            case 1:
                return {
                    bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/10",
                    border: "border-yellow-500/40",
                    rankColor: "text-yellow-400",
                    icon: "🥇",
                    glow: "shadow-yellow-500/20",
                };
            case 2:
                return {
                    bg: "bg-gradient-to-r from-slate-400/20 to-slate-500/10",
                    border: "border-slate-400/40",
                    rankColor: "text-slate-300",
                    icon: "🥈",
                    glow: "shadow-slate-400/20",
                };
            case 3:
                return {
                    bg: "bg-gradient-to-r from-orange-600/20 to-amber-700/10",
                    border: "border-orange-500/40",
                    rankColor: "text-orange-400",
                    icon: "🥉",
                    glow: "shadow-orange-500/20",
                };
            default:
                return {
                    bg: "bg-slate-800/50",
                    border: "border-slate-700/30",
                    rankColor: "text-slate-400",
                    icon: null,
                    glow: "",
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center p-4 relative overflow-hidden">
            <Helmet>
                <title>Endless Tic-Tac-Toe | Leaderboard</title>
                <meta name="description" content="View the global leaderboard of Endless Tic-Tac-Toe Champions. Top 2 players win exciting prizes every month!" />
            </Helmet>

            {/* Particle Background */}
            <ParticleBackground particleColor="mixed" />

            {/* Sound Button */}
            <SoundButton />

            {/* Home Button - Top Left */}
            <button
                onClick={() => { playSound('buttonClick'); navigate('/'); }}
                className="fixed top-4 left-4 z-50 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700/80 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
                <span>🏠</span> Home
            </button>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-blue-500/5 animate-gradient pointer-events-none" />

            {/* Glowing orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Grid decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-2xl mt-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3">
                        <span className="block drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] animate-text-glow">🏆</span>
                        <span className="block bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                            Leaderboard
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        {leaderboard.length > 0 ? `${leaderboard.length} Champions who defeated the AI` : 'Champions who defeated the AI'}
                    </p>

                    {/* Decorative line */}
                    <div className="flex justify-center items-center gap-3 mt-4">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/50"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-300"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500/50"></div>
                    </div>
                </div>

                {/* Prize Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl border border-purple-500/30 backdrop-blur-sm animate-pulse">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <span className="text-2xl">🎁</span>
                        <div className="text-center">
                            <p className="text-white font-bold text-lg">Top 2 Players Win Exciting Prizes!</p>
                            <p className="text-purple-300 text-sm">Winners announced at the end of every month 🎉</p>
                        </div>
                        <span className="text-2xl">🎁</span>
                    </div>
                </div>

                {/* Leaderboard Card */}
                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                    {/* Horizontal scroll wrapper for mobile */}
                    <div className="overflow-x-auto">
                        {/* Table Header - Fixed */}
                        <div className="grid grid-cols-12 gap-2 px-6 py-4 bg-slate-900/50 border-b border-slate-700/50 text-sm font-semibold text-slate-400 uppercase tracking-wide sticky top-0 z-10 min-w-[600px]">
                            <div className="col-span-1 text-center">Rank</div>
                            <div className="col-span-5">Player</div>
                            <div className="col-span-3 text-center">Time <span className="text-xs normal-case">(mm:ss.ms)</span></div>
                            <div className="col-span-3 text-right">Played</div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="divide-y divide-slate-700/30 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 min-w-[600px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span className="text-lg">Loading champions...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12 px-6">
                                    <p className="text-red-400 text-lg mb-4">{error}</p>

                                    {/* Prize Info in error state */}
                                    <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 rounded-xl p-4 mb-6 border border-yellow-500/20">
                                        <p className="text-yellow-400 font-semibold flex items-center justify-center gap-2">
                                            <span>🏆</span> Top 2 players win exciting prizes every month! <span>🎁</span>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { playSound('buttonClick'); fetchLeaderboard(); }}
                                        className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                                    >
                                        🔄 Retry
                                    </button>
                                </div>
                            ) : leaderboard.length === 0 ? (
                                <div className="text-center py-12 px-6">
                                    <div className="text-6xl mb-4 animate-bounce">🎮</div>
                                    <p className="text-2xl font-bold text-white mb-2">No Champions Yet!</p>
                                    <p className="text-slate-400 mb-4">Be the first to defeat the AI and claim the throne.</p>

                                    {/* Prize Info Box */}
                                    <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 rounded-xl p-4 mb-6 border border-yellow-500/20">
                                        <p className="text-yellow-400 font-semibold flex items-center justify-center gap-2">
                                            <span>🏆</span> Top 2 players win exciting prizes every month! <span>🎁</span>
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { playSound('buttonClick'); navigate('/ai'); }}
                                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all"
                                    >
                                        🤖 Challenge AI & Win Prizes!
                                    </button>
                                </div>
                            ) : (
                                leaderboard.map((entry, index) => {
                                    const rank = index + 1;
                                    const style = getRankStyle(rank);
                                    return (
                                        <div
                                            key={entry.id || index}
                                            className={`grid grid-cols-12 gap-2 px-6 py-4 ${style.bg} border-l-4 ${style.border} transition-all duration-300 hover:bg-slate-700/40 hover:scale-[1.01] cursor-default ${style.glow} shadow-lg`}
                                        >
                                            {/* Rank */}
                                            <div className={`col-span-1 text-center font-bold text-xl ${style.rankColor}`}>
                                                {style.icon || `#${rank}`}
                                            </div>

                                            {/* Name */}
                                            <div className="col-span-5 flex items-center">
                                                <span className="font-semibold text-white text-lg truncate">
                                                    {entry.name}
                                                </span>
                                                {rank === 1 && <span className="ml-2 text-yellow-400 animate-pulse">👑</span>}
                                            </div>

                                            {/* Time */}
                                            <div className="col-span-3 text-center">
                                                <span className="font-mono text-blue-400 font-semibold text-lg">
                                                    {formatTime(entry.timeTakenMs)}
                                                </span>
                                            </div>

                                            {/* Date */}
                                            <div className="col-span-3 text-right flex items-center justify-end">
                                                <span className="text-slate-400 text-sm">
                                                    {formatRelativeDate(entry.datePlayed)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center mt-8 gap-4">
                    <button
                        onClick={() => { playSound('buttonClick'); navigate('/'); }}
                        onMouseEnter={() => playSound('hover')}
                        className="px-8 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700/80 hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                        ← Back to Home
                    </button>
                    <button
                        onClick={() => { playSound('buttonClick'); navigate('/ai'); }}
                        onMouseEnter={() => playSound('hover')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        🤖 Challenge AI
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LeaderboardPage;
