// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundProvider } from "./contexts/SoundContext";
import Home from "./components/Home";
import LocalGame from "./components/Localgame";
import AIgame from "./components/AIgame";
import LeaderboardPage from "./components/LeaderboardPage";

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<LocalGame />} />
          <Route path="/ai" element={<AIgame playerMark="X" aiMark="O" onQuit={() => window.location.href = '/'} />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
