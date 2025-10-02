import React, { useState, useEffect } from "react";
import "./app.css";

const ArabianSimonGame = () => {
  const [gameSeq, setGameSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [level, setLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(null);
  const [isUserFlashing, setIsUserFlashing] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    "ruby",
    "sapphire",
    "emerald",
    "gold",
    "amethyst",
    "topaz",
    "pearl",
    "turquoise",
    "amber",
  ];

  // Create stars on mount
  useEffect(() => {
    const starsContainer = document.getElementById("stars-container");
    if (starsContainer) {
      for (let i = 0; i < 50; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.width = Math.random() * 3 + 1 + "px";
        star.style.height = star.style.width;
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = Math.random() * 2 + 2 + "s";
        starsContainer.appendChild(star);
      }
    }
  }, []);

  // Handle keypress to start game
  useEffect(() => {
    const handleKeyPress = () => {
      if (!started) {
        startGame();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [started]);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setLevel(0);
    setGameSeq([]);
    setUserSeq([]);
    setTimeout(() => levelUp([], 0), 100);
  };

  // Handle button click to start game
  const handleStartClick = () => {
    if (!started && !gameOver) {
      startGame();
    }
  };

  const levelUp = (currentSeq, currentLevel) => {
    setUserSeq([]);
    const newLevel = currentLevel + 1;
    setLevel(newLevel);

    const randIdx = Math.floor(Math.random() * colors.length);
    const randColor = colors[randIdx];
    const newGameSeq = [...currentSeq, randColor];
    setGameSeq(newGameSeq);

    setTimeout(() => {
      flashSequence(newGameSeq);
    }, 500);
  };

  const flashSequence = (sequence) => {
    sequence.forEach((color, idx) => {
      setTimeout(() => {
        setIsFlashing(color);
        setTimeout(() => setIsFlashing(null), 250);
      }, idx * 350);
    });
  };

  const checkAnswer = (idx, currentUserSeq) => {
    if (currentUserSeq[idx] === gameSeq[idx]) {
      if (currentUserSeq.length === gameSeq.length) {
        setTimeout(() => levelUp(gameSeq, level), 1000);
      }
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    setStarted(false);

    // Flash red background
    document.body.classList.add("game-over-flash");
    setTimeout(() => {
      document.body.classList.remove("game-over-flash");
    }, 200);
  };

  const handleButtonClick = (color) => {
    if (!started || isFlashing) return;

    setIsUserFlashing(color);
    setTimeout(() => setIsUserFlashing(null), 250);

    const newUserSeq = [...userSeq, color];
    setUserSeq(newUserSeq);
    checkAnswer(newUserSeq.length - 1, newUserSeq);
  };

  const resetGame = () => {
    startGame();
  };

  return (
    <div className="game-container">
      <div className="stars" id="stars-container"></div>

      <div className="decoration top-left">🕌</div>
      <div className="decoration bottom-right">✨</div>

      <div className="header">
        <h1>🌙 Arabian Nights 🌙</h1>
        <h2>Simon Says</h2>

        {!started && !gameOver && (
          <div className="start-message">
            <div>
              ✨ Press any key or click below to begin your magical journey ✨
            </div>
            <button className="start-btn" onClick={handleStartClick}>
              🚀 Start Game
            </button>
          </div>
        )}

        {started && !gameOver && (
          <div className="level-display">
            <div className="level-number">Level {level}</div>
            <div className="level-subtitle">
              Follow the enchanted gems sequence
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-over-box">
            <div className="game-over-title">🌟 Journey Complete! 🌟</div>
            <div className="game-over-score">
              Your score: <span className="score-highlight">{level}</span>
            </div>
            <button className="restart-btn" onClick={resetGame}>
              Start New Journey
            </button>
          </div>
        )}
      </div>

      <div className="game-board">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleButtonClick(color)}
            disabled={!started || isFlashing}
            className={`gem-btn ${color} ${
              isFlashing === color ? "flash" : ""
            } ${isUserFlashing === color ? "user-flash" : ""}`}
          >
            <div className="gem-overlay"></div>
            <div className="gem-pattern"></div>
            <div className="gem-icon">💎</div>
          </button>
        ))}
      </div>

      <div className="footer">
        <p>🌟 May the magic of Arabian Nights guide your memory 🌟</p>
      </div>
    </div>
  );
};

export default ArabianSimonGame;
