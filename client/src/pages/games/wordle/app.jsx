import React, { useState, useEffect } from "react";
import "./app.css";

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
  "camel",
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
  };

  const resetGame = () => {
    pickWord();
    createBoard();
  };

  useEffect(() => {
    resetGame();
  }, []);

  // Listen to physical keyboard
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
      // Priority: correct > present > absent
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
      setMessage("✨ You found the word! ✨");
    } else if (currentRowIndex + 1 >= maxRows) {
      setGameOver(true);
      setMessage(`Game Over! The word was: ${answer}`);
    } else {
      setCurrentRowIndex(currentRowIndex + 1);
    }
  };

  return (
    <div className="arabian-container">
      <h1>🌙 Arabian Nights Wordle 🕌</h1>

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

      <button onClick={resetGame}>PLAY AGAIN</button>

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

      <div className="instructions">
        <p>🟢 Correct | 🟡 Wrong Place | ⚫ Not in Word</p>
      </div>
    </div>
  );
}
