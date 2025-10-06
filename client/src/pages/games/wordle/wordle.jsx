import React, { useState, useEffect } from "react";
import "./wordle.css";

const InfoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const wordList = [
  "genie",
  "lampy",
  "oasis",
  "dunes",
  "magic",
  "jinni",
  "harem",
  "sands",
  "sheik",
  "talis",
  "veils",
  "coins",
  "tower",
  "jewel",
  "quest",
  "ruggy",
  "djinn",
  "sails",
  "mages",
  "sabra",
  "minar",
  "bazar",
  "flame",
  "nomad",
  "palms",
  "spice",
  "night",
  "dream",
  "pearl",
  "sword",
  "carav",
  "tiger",
  "realm",
  "torch",
  "crown",
  "dates",
  "siroc",
  "attar",
  "noble",
  "vizir",
  "sabre",
  "caves",
  "myrrh",
  "amber",
  "spahi",
  "kohls",
  "palmy",
  "mirza",
  "ifrit",
  "apple",
  "grape",
  "pearl",
  "stone",
  "flame",
  "crown",
  "chair",
  "plant",
  "light",
  "table",
  "river",
  "mouse",
  "house",
  "bread",
  "sugar",
  "smile",
  "happy",
  "cloud",
  "storm",
  "eagle",
  "tiger",
  "zebra",
  "horse",
  "sheep",
  "goose",
  "camel",
  "piano",
  "drums",
  "flute",
  "viola",
  "cello",
  "brush",
  "paint",
  "green",
  "black",
  "white",
  "brown",
  "cream",
  "lemon",
  "mango",
  "peach",
  "berry",
  "melon",
  "olive",
  "onion",
  "spice",
  "chili",
  "sauce",
  "pasta",
  "pizza",
  "bread",
  "cheer",
  "pride",
  "dance",
  "music",
  "voice",
  "sound",
  "magic",
  "dream",
  "story",
  "fairy",
  "giant",
  "angel",
  "devil",
  "queen",
  "sword",
  "arrow",
  "lance",
  "tower",
  "field",
  "ocean",
  "beach",
  "coral",
  "shark",
  "whale",
  "dolph",
  "squid",
  "plant",
  "grass",
  "trees",
  "leave",
  "seeds",
  "roots",
  "earth",
  "rocks",
  "metal",
  "steel",
  "glass",
  "brick",
  "wires",
  "cable",
  "motor",
  "gears",
  "wings",
  "train",
  "plane",
  "ships",
  "truck",
  "roads",
];

const rows = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["⏎", ..."ZXCVBNM".split(""), "⌫"],
];

export default function WordleArabian() {
  const wordLength = 5;
  const maxRows = 6;
  const [answer, setAnswer] = useState("");
  const [board, setBoard] = useState([]);
  const [currentRow, setCurrentRow] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [keyStatuses, setKeyStatuses] = useState({});
  const [message, setMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  // Points system
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [pointsBreakdown, setPointsBreakdown] = useState({
    base: 0,
    speed: 0,
    streak: 0,
    bonus: 0,
  });

  const pickWord = () => {
    const randomWord =
      wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    setAnswer(randomWord);
  };

  const createBoard = () => {
    const newBoard = Array.from({ length: maxRows }, () =>
      Array.from({ length: wordLength }, () => ({ letter: "", status: "" }))
    );
    setBoard(newBoard);
    setCurrentRow([]);
    setCurrentRowIndex(0);
    setGameOver(false);
    setKeyStatuses({});
    setMessage("");
    setCurrentPoints(0);
    setPointsBreakdown({ base: 0, speed: 0, streak: 0, bonus: 0 });
  };

  const resetGame = () => {
    pickWord();
    createBoard();
    setStreak(0); // Reset streak when manually resetting
    setTotalPoints(0);
  };

  const calculatePoints = (attemptsUsed, won) => {
    if (!won) return 0;

    // Base points: More points for fewer attempts
    const basePoints = (maxRows - attemptsUsed + 1) * 100;

    // Speed bonus: Extra points based on how quickly solved
    let speedBonus = 0;
    if (attemptsUsed === 1) speedBonus = 500; // Perfect!
    else if (attemptsUsed === 2) speedBonus = 300;
    else if (attemptsUsed === 3) speedBonus = 200;
    else if (attemptsUsed === 4) speedBonus = 100;
    else if (attemptsUsed === 5) speedBonus = 50;

    // Streak bonus: 50 points per streak level
    const streakBonus = streak * 50;

    // First try bonus
    const firstTryBonus = attemptsUsed === 1 ? 1000 : 0;

    const breakdown = {
      base: basePoints,
      speed: speedBonus,
      streak: streakBonus,
      bonus: firstTryBonus,
    };

    const total = basePoints + speedBonus + streakBonus + firstTryBonus;

    setPointsBreakdown(breakdown);
    setCurrentPoints(total);
    setTotalPoints((prev) => prev + total);

    return total;
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        handleKey("⏎");
      } else if (key === "BACKSPACE") {
        handleKey("⌫");
      } else if (/^[A-Z]$/.test(key)) {
        handleKey(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRow, currentRowIndex, gameOver, answer]);

  const updateBoard = (rowIdx, newRow) => {
    const newBoard = [...board];
    newBoard[rowIdx] = newRow;
    setBoard(newBoard);
  };

  const updateKeyStatus = (letter, status) => {
    setKeyStatuses((prev) => {
      const currentStatus = prev[letter];
      if (currentStatus === "correct") return prev;
      if (currentStatus === "present" && status === "absent") return prev;
      return { ...prev, [letter]: status };
    });
  };

  const handleKey = (key) => {
    if (gameOver) return;

    if (key === "⌫") {
      deleteLetter();
      return;
    }
    if (key === "⏎") {
      submitWord();
      return;
    }

    if (currentRow.length < wordLength) {
      const newRow = [...currentRow, key];
      setCurrentRow(newRow);

      const rowCopy = [...board[currentRowIndex]];
      rowCopy[newRow.length - 1] = { letter: key, status: "" };
      updateBoard(currentRowIndex, rowCopy);
    }
  };

  const deleteLetter = () => {
    if (currentRow.length > 0) {
      const newRow = currentRow.slice(0, -1);
      setCurrentRow(newRow);

      const rowCopy = [...board[currentRowIndex]];
      rowCopy[newRow.length] = { letter: "", status: "" };
      updateBoard(currentRowIndex, rowCopy);
    }
  };

  const submitWord = () => {
    if (currentRow.length < wordLength) {
      setMessage("⚠️ Not enough letters!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const guess = currentRow.join("");
    const rowCopy = [...board[currentRowIndex]];

    currentRow.forEach((letter, i) => {
      let status;
      if (letter === answer[i]) {
        status = "correct";
      } else if (answer.includes(letter)) {
        status = "present";
      } else {
        status = "absent";
      }
      rowCopy[i] = { letter, status };
      updateKeyStatus(letter, status);
    });

    updateBoard(currentRowIndex, rowCopy);
    setCurrentRow([]);

    if (guess === answer) {
      setGameOver(true);
      setGamesPlayed((prev) => prev + 1);
      setGamesWon((prev) => prev + 1);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      const points = calculatePoints(currentRowIndex + 1, true);

      let msg = "✨ You found the word! ✨\n";
      if (currentRowIndex === 0) msg += "🏆 PERFECT! First try!";
      else if (currentRowIndex === 1) msg += "🌟 Amazing! 2 tries!";
      else if (currentRowIndex === 2) msg += "👏 Great! 3 tries!";
      else msg += "🎉 Well done!";
      msg += `\n💎 +${points} points!`;

      setMessage(msg);
    } else if (currentRowIndex + 1 >= maxRows) {
      setGameOver(true);
      setGamesPlayed((prev) => prev + 1);
      setStreak(0); // Break streak on loss
      setMessage(`Game Over! The word was: ${answer}\n❌ No points earned`);
    } else {
      setCurrentRowIndex(currentRowIndex + 1);
    }
  };

  const continueGame = () => {
    pickWord();
    createBoard();
    // Keep streak and stats intact
  };

  return (
    <div className="arabian-container">
      <div className="game-wrapper">
        {/* Left Sidebar - Instructions */}
        <aside className="sidebar left-sidebar">
          <div className="sidebar-content">
            <button
              className="info-button-mobile"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <InfoIcon /> How to Play
            </button>

            <div className="instructions-sidebar">
              <h2>🎮 How to Play</h2>
              <p className="goal">
                Guess the 5-letter Arabian word in 6 tries!
              </p>

              <div className="example-section">
                <p>
                  <strong>Color Guide:</strong>
                </p>
                <div className="example-row">
                  <div className="example-tile correct">G</div>
                  <span className="example-text">Correct spot</span>
                </div>
                <div className="example-row">
                  <div className="example-tile present">A</div>
                  <span className="example-text">Wrong spot</span>
                </div>
                <div className="example-row">
                  <div className="example-tile absent">X</div>
                  <span className="example-text">Not in word</span>
                </div>
              </div>

              <div className="tips-section">
                <p>
                  <strong>💡 Scoring:</strong>
                </p>
                <ul>
                  <li>🏆 1 try: 1600 pts + bonuses</li>
                  <li>⭐ 2 tries: 800 pts</li>
                  <li>👍 3 tries: 600 pts</li>
                  <li>✨ Streak bonus: +50/streak</li>
                  <li>⚠️ "Play Again" resets points!</li>
                </ul>
              </div>

              <div className="tips-section">
                <p>
                  <strong>💫 Tips:</strong>
                </p>
                <ul>
                  <li>Use keyboard or tap keys</li>
                  <li>Press Enter to submit</li>
                  <li>Arabian themed words! 🧞‍♂️</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Game Area */}
        <main className="game-area">
          <button
            className="info-button-mobile"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <InfoIcon /> How to Play
          </button>

          <h1>🌙 Arabian Nights Wordle 🕌</h1>

          {/* Mobile Points Display */}
          <div className="mobile-points-display">
            <div className="mobile-score">
              💰 Score: <strong>{totalPoints}</strong>
            </div>
            <div className="mobile-streak">
              🔥 Streak: <strong>{streak}</strong>
            </div>
          </div>

          {/* Current Game Points */}
          {currentPoints > 0 && (
            <div className="points-earned">
              <h3>💎 Points Earned: {currentPoints}</h3>
              <div className="points-breakdown">
                {pointsBreakdown.base > 0 && (
                  <span>Base: {pointsBreakdown.base}</span>
                )}
                {pointsBreakdown.speed > 0 && (
                  <span>Speed: +{pointsBreakdown.speed}</span>
                )}
                {pointsBreakdown.streak > 0 && (
                  <span>Streak: +{pointsBreakdown.streak}</span>
                )}
                {pointsBreakdown.bonus > 0 && (
                  <span>🏆 Perfect: +{pointsBreakdown.bonus}</span>
                )}
              </div>
            </div>
          )}

          {message && <div className="message">{message}</div>}

          <div id="board">
            {board.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div key={`${rIdx}-${cIdx}`} className={`tile ${cell.status}`}>
                  {cell.letter}
                </div>
              ))
            )}
          </div>

          <div className="button-group">
            {gameOver && (
              <button onClick={continueGame} className="continue-button">
                Continue
              </button>
            )}
            <button onClick={resetGame} className="reset-button-main">
              Play Again
            </button>
          </div>

          <div id="keyboard">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="kb-row">
                {row.map((k, i) => (
                  <div
                    key={i}
                    className={`key ${keyStatuses[k] || ""}`}
                    onClick={() => handleKey(k)}
                  >
                    {k}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bottom-info">
            <p>🟢 Correct | 🟡 Wrong Place | ⚫ Not in Word</p>
          </div>
        </main>

        {/* Right Sidebar - Stats & Points */}
        <aside className="sidebar right-sidebar">
          <div className="sidebar-content">
            <div className="points-display">
              <h3>💰 Total Score</h3>
              <div className="total-points">{totalPoints}</div>
              <div className="streak-display">
                🔥 Streak: <strong>{streak}</strong>
                {bestStreak > 0 && (
                  <span className="best-streak"> (Best: {bestStreak})</span>
                )}
              </div>
            </div>

            <div className="stats-section">
              <h3>📊 Game Stats</h3>
              <div className="stat-item">
                <span className="stat-label">Games Played:</span>
                <span className="stat-value">{gamesPlayed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Games Won:</span>
                <span className="stat-value">{gamesWon}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Win Rate:</span>
                <span className="stat-value">
                  {gamesPlayed > 0
                    ? Math.round((gamesWon / gamesPlayed) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Row:</span>
                <span className="stat-value">
                  {currentRowIndex + 1} / {maxRows}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Letters Used:</span>
                <span className="stat-value">
                  {Object.keys(keyStatuses).length}
                </span>
              </div>
            </div>

            <div className="word-bank">
              <h3>🏺 Scoring System</h3>
              <div className="scoring-guide">
                <div className="score-row">
                  <span>1st try:</span>
                  <span>1600 pts 🏆</span>
                </div>
                <div className="score-row">
                  <span>2nd try:</span>
                  <span>800 pts ⭐</span>
                </div>
                <div className="score-row">
                  <span>3rd try:</span>
                  <span>600 pts 👍</span>
                </div>
                <div className="score-row">
                  <span>4th try:</span>
                  <span>400 pts ✓</span>
                </div>
                <div className="score-row">
                  <span>5th try:</span>
                  <span>250 pts</span>
                </div>
                <div className="score-row">
                  <span>6th try:</span>
                  <span>100 pts</span>
                </div>
                <div className="bonus-info">
                  <p>+ Streak Bonus: 50pts/win</p>
                  <p>⚠️ Reset = Lose all points!</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Instructions Modal */}
      {showInstructions && (
        <div
          className="instructions-modal"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="instructions-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowInstructions(false)}
            >
              ✕
            </button>
            <h2>🎮 How to Play</h2>
            <div className="instructions-text">
              <p>
                <strong>Goal:</strong> Guess the 5-letter Arabian-themed word in
                6 tries!
              </p>

              <div className="example-section">
                <p>
                  <strong>After each guess:</strong>
                </p>
                <div className="example-tiles">
                  <div className="example-tile correct">G</div>
                  <div className="example-tile">E</div>
                  <div className="example-tile">N</div>
                  <div className="example-tile">I</div>
                  <div className="example-tile">E</div>
                </div>
                <p className="example-desc">
                  🟢 <strong>Green:</strong> Correct position
                </p>

                <div className="example-tiles">
                  <div className="example-tile">M</div>
                  <div className="example-tile present">A</div>
                  <div className="example-tile">G</div>
                  <div className="example-tile">I</div>
                  <div className="example-tile">C</div>
                </div>
                <p className="example-desc">
                  🟡 <strong>Yellow:</strong> Wrong position
                </p>

                <div className="example-tiles">
                  <div className="example-tile">O</div>
                  <div className="example-tile">A</div>
                  <div className="example-tile">S</div>
                  <div className="example-tile absent">I</div>
                  <div className="example-tile">S</div>
                </div>
                <p className="example-desc">
                  ⚫ <strong>Gray:</strong> Not in word
                </p>
              </div>

              <div className="tips-section">
                <p>
                  <strong>💎 Scoring:</strong>
                </p>
                <ul>
                  <li>1 try: 1600 pts 🏆</li>
                  <li>2 tries: 800 pts ⭐</li>
                  <li>3 tries: 600 pts 👍</li>
                  <li>Build streaks for bonuses!</li>
                  <li>⚠️ "Play Again" resets all!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
