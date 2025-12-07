// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundProvider } from "./contexts/SoundContext";
import Home from "./components/Home";
import LocalGame from "./components/Localgame";
import AIgameWrapper from "./components/AigameWrapper";

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<LocalGame />} />
          <Route path="/ai" element={<AIgameWrapper />} />
        </Routes>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
