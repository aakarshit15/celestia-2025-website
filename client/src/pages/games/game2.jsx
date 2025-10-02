import React, { useState, useEffect } from "react";
import "./index2.css";

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
  "camel",
  "night",
  "dream",
  "pearl",
  "sword",
  "jewel",
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
  };

  const resetGame = () => {
    pickWord();
    createBoard();
  };

  useEffect(() => {
    resetGame();
  }, []);

  const updateBoard = (rowIdx, newRow) => {
    const newBoard = [...board];
    newBoard[rowIdx] = newRow;
    setBoard(newBoard);
  };

  const handleKey = (key) => {
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
    if (currentRow.length < wordLength) return;
    const guess = currentRow.join("");

    const rowCopy = [...board[currentRowIndex]];
    currentRow.forEach((letter, i) => {
      if (letter === answer[i]) {
        rowCopy[i] = { letter, status: "correct" };
      } else if (answer.includes(letter)) {
        rowCopy[i] = { letter, status: "present" };
      } else {
        rowCopy[i] = { letter, status: "absent" };
      }
    });

    updateBoard(currentRowIndex, rowCopy);
    setCurrentRow([]);

    if (guess === answer) {
      setTimeout(() => alert("✨ You found the word!"), 300);
    } else {
      setCurrentRowIndex(currentRowIndex + 1);
    }
  };

  return (
    <div className="arabian-container">
      <h1>🌙 Arabian Nights Wordle 🕌</h1>
      <div id="board">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className={`tile ${cell.status}`}>
              {cell.letter}
            </div>
          ))
        )}
      </div>
      {/* <div>
        <p>correct - Green present but wrong place - Yellow absent - Grey</p>
      </div> */}
      <button onClick={resetGame}>Reset</button>
      <div id="keyboard">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="kb-row">
            {row.map((k, i) => (
              <div key={i} className="key" onClick={() => handleKey(k)}>
                {k}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
