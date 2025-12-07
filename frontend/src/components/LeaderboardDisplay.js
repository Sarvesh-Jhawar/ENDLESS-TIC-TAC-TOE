import React, { useState, useEffect } from "react";
import axios from "axios";

function LeaderboardDisplay({ onClose }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/leaderboard/top");
            setLeaderboard(response.data);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            setError("Failed to load leaderboard");
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
            return diffInHours === 1 ? "1 hr ago" : `${diffInHours} hrs ago`;
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
                    border: "border-yellow-500/30",
                    rankColor: "text-yellow-400",
                    icon: "🥇",
                };
            case 2:
                return {
                    bg: "bg-gradient-to-r from-slate-400/20 to-slate-500/10",
                    border: "border-slate-400/30",
                    rankColor: "text-slate-300",
                    icon: "🥈",
                };
            case 3:
                return {
                    bg: "bg-gradient-to-r from-orange-600/20 to-amber-700/10",
                    border: "border-orange-500/30",
                    rankColor: "text-orange-400",
                    icon: "🥉",
                };
            default:
                return {
                    bg: "bg-slate-800/50",
                    border: "border-slate-700/30",
                    rankColor: "text-slate-400",
                    icon: null,
                };
        }
    };

    return (
        <div className="animate-victory-burst">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="text-xl font-bold text-white mb-1">Leaderboard</h3>
                    <p className="text-slate-400 text-sm">Top 10 Champions • Time (mm:ss.ms)</p>
                </div>

                {/* Prize Banner */}
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-xl border border-purple-500/30">
                    <p className="text-white text-sm font-medium text-center">
                        🎁 <span className="text-purple-300">Top 2 win prizes every month!</span> 🎁
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-400">
                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={fetchLeaderboard}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <div className="text-4xl mb-3 animate-bounce">🎮</div>
                            <p className="font-medium text-white">No champions yet!</p>
                            <p className="text-sm mt-1">Beat the AI to claim your spot!</p>
                            <p className="text-xs mt-3 text-yellow-400">🏆 Top 2 win exciting prizes! 🎁</p>
                        </div>
                    ) : (
                        leaderboard.map((entry, index) => {
                            const rank = index + 1;
                            const style = getRankStyle(rank);
                            return (
                                <div
                                    key={entry.id || index}
                                    className={`flex items-center gap-3 p-3 rounded-xl border ${style.bg} ${style.border} transition-all duration-200 hover:scale-[1.02] hover:bg-slate-700/50`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Rank */}
                                    <div className={`w-8 text-center font-bold ${style.rankColor}`}>
                                        {style.icon || `#${rank}`}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate">
                                            {entry.name}
                                        </p>
                                    </div>

                                    {/* Time */}
                                    <div className="text-center">
                                        <span className="font-mono text-blue-400 font-semibold text-sm">
                                            {formatTime(entry.timeTakenMs)}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="text-right w-20">
                                        <span className="text-slate-400 text-xs">
                                            {formatRelativeDate(entry.datePlayed)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="mt-4 w-full py-3 bg-slate-700/80 text-white font-medium rounded-xl border border-slate-600/50 hover:bg-slate-600/80 transition-all duration-200"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}

export default LeaderboardDisplay;
