// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LocalGame from "./components/Localgame";
import AIgameWrapper from "./components/AigameWrapper";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/local" element={<LocalGame />} />
        <Route path="/ai" element={<AIgameWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
