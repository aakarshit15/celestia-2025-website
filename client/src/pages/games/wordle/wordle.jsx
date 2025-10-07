import React, { useState, useEffect } from "react";
import bgImg from "../../../assets/bgimage.png";

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
  "haram",
  "boobs",
  "sands",
  "sheik",
  "talis",
  "veils",
  "coins",
  "tower",
  "jewel",
  "quest",
  "ruggy",
  "busty",
  "djinn",
  "sails",
  "mages",
  "sabra",
  "minar",
  "mommy",
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
    <div
      className="min-h-screen text-yellow-400 relative overflow-x-hidden bg-cover"
      style={{ backgroundImage: `url('${bgImg}')` }}
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="relative z-10 gap-5 mx-auto p-5 min-h-screen flex flex-row">
        {/* Center - Game Area */}
        <main className="flex-6 flex flex-col items-center justify-start px-2.5">
          <div className="flex flex-row gap-7">
            <button
              className=" flex items-center justify-center gap-2 w-full max-w-[400px] mx-auto bg-yellow-400/20 border-2 border-yellow-400 text-yellow-400 py-2 px-5 rounded-xl text-base font-bold cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all hover:bg-yellow-400/30 hover:-translate-y-0.5"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <InfoIcon /> How to Play
            </button>
            <div className="flex flex-col items-center gap-3">
              {gameOver && (
                <button
                  onClick={continueGame}
                  className="py-3 px-6 rounded-xl border-none text-base font-bold cursor-pointer transition-all bg-gradient-to-br from-[#00ff73] to-[#44ff00] text-black shadow-[0_0_15px_rgba(0,255,115,0.6)] hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(0,255,115,0.8)]"
                >
                  Continue
                </button>
              )}
              <button
                onClick={resetGame}
                className="py-3 px-6 rounded-xl border-none text-base font-bold cursor-pointer transition-all bg-gradient-to-br from-[#ffae00] to-[#ffd700] text-black shadow-[0_0_15px_rgba(255,215,0,0.6)] hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)]"
              >
                Play Again
              </button>
            </div>
          </div>

          <h1 className="my-8 lg:mt-4 lg:mb-2 text-3xl text-yellow-400 text-center">
            🌙 Arabian Nights Wordle 🕌
          </h1>

          {message && (
            <div className="bg-yellow-400/20 border-2 border-yellow-400 text-yellow-400 py-3 px-5 my-2.5 mb-5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,215,0,0.5)] text-center whitespace-pre-line">
              {message}
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 justify-center mx-auto mb-4">
            {board.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-[70px] h-[70px] md:w-[60px] md:h-[60px] sm:w-[50px] sm:h-[50px] border-2 border-yellow-400 flex justify-center items-center text-3xl md:text-2xl sm:text-xl font-bold bg-black/60 text-white uppercase shadow-[0_0_10px_rgba(255,217,0,0.5)] transition-all rounded backdrop-blur-sm ${
                    cell.status === "correct"
                      ? "bg-gradient-to-br from-[#44ff00] to-[#00ff73] !text-black !border-emerald-400"
                      : cell.status === "present"
                      ? "bg-gradient-to-br from-[#d5f65c] to-[#a88d21] !text-white !border-[#d5f65c]"
                      : cell.status === "absent"
                      ? "bg-gray-700/90 !text-white !border-gray-600"
                      : ""
                  }`}
                >
                  {cell.letter}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-1.5">
                {row.map((k, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 px-2 bg-black/40 text-yellow-400 uppercase shadow-[0_0_10px_rgba(255,215,0,0.3)] border border-gray-300 rounded-md cursor-pointer select-none font-bold transition-all hover:bg-yellow-400/20 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] active:translate-y-0 active:bg-yellow-400/30 backdrop-blur-sm ${
                      keyStatuses[k] === "correct"
                        ? "!bg-gradient-to-br !from-[#44ff00] !to-[#00ff73] !text-black !border-emerald-400"
                        : keyStatuses[k] === "present"
                        ? "!bg-gradient-to-br !from-[#d5f65c] !to-[#a88d21] !text-white !border-[#d5f65c]"
                        : keyStatuses[k] === "absent"
                        ? "!bg-gray-700/80 !text-white !border-gray-600"
                        : ""
                    }`}
                    onClick={() => handleKey(k)}
                  >
                    {k}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="lg:hidden text-center p-2.5 bg-black/50 rounded-xl mt-2.5">
            <p className="text-yellow-400 text-sm m-0">
              🟢 Correct | 🟡 Wrong Place | ⚫ Not in Word
            </p>
          </div>
        </main>
      </div>

      {/* Mobile Instructions Modal */}
      {showInstructions && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000] p-5"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="bg-gradient-to-br from-[#1a0b2e] to-[#2d1b4e] border-4 border-yellow-400 rounded-2xl max-w-[500px] w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-[0_0_30px_rgba(255,215,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-red-500/20 border-2 border-red-400 text-red-400 w-9 h-9 rounded-full cursor-pointer text-xl flex items-center justify-center p-0 transition-all hover:bg-red-500/40 hover:rotate-90"
              onClick={() => setShowInstructions(false)}
            >
              ✕
            </button>
            <h2 className="text-yellow-400 m-0 mb-5 text-2xl text-center">
              🎮 How to Play
            </h2>
            <div className="text-yellow-400 text-left">
              <p className="my-2.5 leading-relaxed text-sm">
                <strong>Goal:</strong> Guess the 5-letter Arabian-themed word in
                6 tries!
              </p>

              <div className="bg-black/30 p-4 rounded-xl my-4">
                <p className="my-2.5 leading-relaxed text-sm text-center mb-5">
                  <strong>After each guess:</strong>
                </p>
                <div className="flex gap-1.5 my-2.5 justify-center">
                  <div className="w-9 h-9 border-2 border-emerald-400 flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#44ff00] to-[#00ff73] text-black rounded">
                    G
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    E
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    N
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    I
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    E
                  </div>
                </div>
                <p className="text-sm my-1.5 mb-4 text-center">
                  🟢 <strong>Green:</strong> Correct position
                </p>

                <div className="flex gap-1.5 my-2.5 justify-center">
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    M
                  </div>
                  <div className="w-9 h-9 border-2 border-[#d5f65c] flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#d5f65c] to-[#a88d21] text-white rounded">
                    A
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    G
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    I
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    C
                  </div>
                </div>
                <p className="text-sm my-1.5 mb-4 text-center">
                  🟡 <strong>Yellow:</strong> Wrong position
                </p>

                <div className="flex gap-1.5 my-2.5 justify-center">
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    O
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    A
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    S
                  </div>
                  <div className="w-9 h-9 border-2 border-gray-600 flex items-center justify-center font-bold text-lg bg-gray-700/90 text-white rounded">
                    I
                  </div>
                  <div className="w-9 h-9 border-2 border-yellow-400 flex items-center justify-center font-bold text-lg bg-black/60 text-white rounded">
                    S
                  </div>
                </div>
                <p className="text-sm my-1.5 mb-4 text-center">
                  ⚫ <strong>Gray:</strong> Not in word
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
