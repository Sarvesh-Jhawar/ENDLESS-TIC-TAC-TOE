import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="title-container">
        <h1 className="main-title">
          <span>Endless</span>
          <span className="subtitle">Tic Tac Toe</span>
        </h1>
        <p className="tagline">A new era of a classic game.</p>
      </div>
      <div className="button-group">
        <button className="btn btn-primary" onClick={() => navigate("/local")}>
          Play with a Friend
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/ai")}>
          Challenge the AI
        </button>
      </div>
    </div>
  );
}

export default Home;