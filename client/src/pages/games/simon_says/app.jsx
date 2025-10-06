import React, { useState, useEffect } from "react";
import "./arya.css";
import img1 from "../../../../src/assets/simon_says/arabianSym1.png";
import img2 from "../../../../src/assets/simon_says/arabianSym2.png";
import img3 from "../../../../src/assets/simon_says/arabianSym3.png";
import img4 from "../../../../src/assets/simon_says/arabianSym4.png";
import img5 from "../../../../src/assets/simon_says/arabianSym5.png";
import img6 from "../../../../src/assets/simon_says/arabianSym6.png";
import img7 from "../../../../src/assets/simon_says/arabianSym7.png";
import img8 from "../../../../src/assets/simon_says/arabianSym8.png";
import img9 from "../../../../src/assets/simon_says/arabianSym9.png";

const ArabianSimonGame = () => {
  const [gameSeq, setGameSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [level, setLevel] = useState(0);
  const [started, setStarted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(null);
  const [isUserFlashing, setIsUserFlashing] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Create a persistent AudioContext to reduce lag
  const audioContextRef = React.useRef(null);

  // Initialize AudioContext once
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    // Resume if suspended
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

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

  // Sound configurations for each gem (frequency and waveform type)
  const soundMap = {
    ruby: { freq: 261.63, type: "sine" }, // C4 - Pure tone
    sapphire: { freq: 293.66, type: "square" }, // D4 - Hollow
    emerald: { freq: 329.63, type: "sine" }, // E4 - Pure tone
    gold: { freq: 349.23, type: "triangle" }, // F4 - Mellow
    amethyst: { freq: 392.0, type: "sine" }, // G4 - Pure tone
    topaz: { freq: 440.0, type: "sawtooth" }, // A4 - Bright
    pearl: { freq: 493.88, type: "sine" }, // B4 - Pure tone
    turquoise: { freq: 523.25, type: "triangle" }, // C5 - Mellow
    amber: { freq: 587.33, type: "square" }, // D5 - Hollow
  };

  // Function to play sound for correct button
  const playSound = (color) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = soundMap[color].freq;
      oscillator.type = soundMap[color].type;

      // Synchronized timing - match visual flash duration (250ms)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.25
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.25);
    } catch (error) {
      console.warn("Audio not supported or blocked:", error);
    }
  };

  // Function to play error sound
  const playErrorSound = () => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Descending dissonant tone for error
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        audioContext.currentTime + 0.5
      );
      oscillator.type = "sawtooth";

      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn("Audio not supported or blocked:", error);
    }
  };

  // Create stars on mount
  // useEffect(() => {
  //   const starsContainer = document.getElementById("stars-container");
  //   if (starsContainer) {
  //     for (let i = 0; i < 50; i++) {
  //       const star = document.createElement("div");
  //       star.className = "star";
  //       star.style.width = Math.random() * 3 + 1 + "px";
  //       star.style.height = star.style.width;
  //       star.style.top = Math.random() * 100 + "%";
  //       star.style.left = Math.random() * 100 + "%";
  //       star.style.animationDelay = Math.random() * 3 + "s";
  //       star.style.animationDuration = Math.random() * 2 + 2 + "s";
  //       starsContainer.appendChild(star);
  //     }
  //   }
  // }, []);

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
        // Play sound when showing the sequence
        playSound(color);
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

    // Play error sound
    playErrorSound();

    // Flash red background
    document.body.classList.add("game-over-flash");
    setTimeout(() => {
      document.body.classList.remove("game-over-flash");
    }, 200);
  };

  const handleButtonClick = (color) => {
    if (!started || isFlashing) return;

    // Play sound when user clicks a button
    playSound(color);

    setIsUserFlashing(color);
    setTimeout(() => setIsUserFlashing(null), 250);

    const newUserSeq = [...userSeq, color];
    setUserSeq(newUserSeq);
    checkAnswer(newUserSeq.length - 1, newUserSeq);
  };

  const resetGame = () => {
    startGame();
  };

  const arabianSym = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  return (
    <div
      className={`game-container flex flex-col justify-center items-center bg-[url(../../../src/assets/simon_says/background4.jpg)] bg-no-repeat bg-cover w-full min-h-[100vh]`}
    >
      {/* <div className="stars" id="stars-container"></div> */}

      {/* <div className="decoration top-left">🕌</div>
      <div className="decoration bottom-right">✨</div> */}

      <div className="header flex flex-col justify-center items-center gap-8">
        <h1 className="text-5xl font-bold font-cinzel text-[#decd0c] text-center">
          Arabian Nights
        </h1>
        <h2 className="text-4xl font-bold font-cinzel justify-self-center text-[#decd0c]">
          Simon Says
        </h2>

        {!started && !gameOver && (
          <div className="start-message flex flex-col justify-center items-center gap-5">
            <div className="text-2xl font-cinzel text-[#decd0c] font-semibold w-[50%] text-center">
              Press any key or click below to begin your magical journey
            </div>
            <button
              className="start-btn text-center text-2xl font-cinzel text-[#585806]  cursor-pointer"
              onClick={handleStartClick}
            >
              Start Game
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
        {started && !gameOver && (
          <div className="gems-row flex flex-wrap justify-center items-center gap-4 mt-8">
            {arabianSym.map((symbol, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(colors[index])}
                disabled={!started || isFlashing}
                className={`gem-btn ${colors[index]} ${
                  isFlashing === colors[index] ? "flash" : ""
                } ${
                  isUserFlashing === colors[index] ? "user-flash" : ""
                } p-5 bg-amber-700 rounded-xl `}
              >
                <div className="gem-overlay"></div>
                <div className="gem-pattern"></div>
                <div className="gem-icon">
                  <img src={symbol} alt={` Gem ${colors[index]}`} id="symbols" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* <div className="footer">
        <p>🌟 May the magic of Arabian Nights guide your memory 🌟</p>
      </div> */}
    </div>
  );
};

export default ArabianSimonGame;
