import React, { useState, useEffect } from 'react'
import { Trophy, QrCode, Hash } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import { getAllGames } from "../apis/games.api";
import { assignPointsByQr, assignPointsByTeamCode, verifyQr } from "../apis/scoring.api";
import { toast } from 'react-toastify';
import axios from "axios";
import Cookies from "js-cookie";

const Scoring = () => {
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [selectedGame, setSelectedGame] = useState();
  const [inputMethod, setInputMethod] = useState('code');
  const [winnerInput, setWinnerInput] = useState('');
  const [loserInput, setLoserInput] = useState('');

  const gameScoring = {
    'Game A': { win: 10, lose: -2 },
    'Game B': { win: 15, lose: 0 },
    'Game C': { win: 20, lose: -5 },
    'Game D': { win: 25, lose: -3 }
  }

  // const games = Object.keys(gameScoring)

  const getGames = async () => {
    try {
      const response = await axios.get(getAllGames);
      console.log("Games fetched: ", response.data);

      // const gameNames = response.data.data.map(game => game.gameName);
      const gameDetails = response.data.data;
      console.log("Game details: ", gameDetails);
      // console.log("Game names: ", gameNames);
      setGames(gameDetails);

      if (gameDetails && gameDetails.length > 0) {
        setSelectedGame(gameDetails[0]._id);
      }
    }
    catch (error) {
      console.log("Error in fetching games", error);
    }
  }

  useEffect(() => {
    getGames();
  }, [])

  const handleScoreSubmit = async () => {
    console.log("Scoring handleSubmit clicked");

    try {

      if (inputMethod === 'code') {
        if (!winnerInput) {
          alert('Please enter the winning team code')
          return
        }

        const data = {
          teamId: winnerInput,
          gameId: selectedGame,
        }

        const token = Cookies.get('token');
        const response = await axios.post(assignPointsByTeamCode, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("Points given: ", response.data);
        toast.success("Score Recorded Successfully");
      }

    } catch (error) {
      console.log("Error in scoring", error);
      switch (error.response.status) {
        case 400:
          toast.error("Invalid team code or game selection");
          break;
        case 401:
          toast.error("Session expired. Please login again");
          break;
        case 403:
          toast.error("You don't have permission to record scores");
          break;
        case 404:
          toast.error("Team or Game Not Found");
          break;
        case 409:
          toast.error("Score already recorded for this match");
          break;
        case 429:
          toast.error("Too many attempts. Please try again later");
          break;
        case 500:
          toast.error("Server error. Please try again later");
          break;
        default:
          toast.error("Failed to record score");
      }
    }
  }

  const handleQRScan = (e) => {
    // TODO: Implement QR scanner functionality
    // This would typically use a library like react-qr-reader or html5-qrcode
    console.log('QR Scan initiated')
  }

  return (
    <>
      <AdminNavbar />
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Record Score</h2>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[10px] sm:text-xs"
              >
                {games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.gameName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="mb-4 sm:mb-6 bg-indigo-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-indigo-900 font-medium">
              {selectedGame} Scoring: Winner gets +{gameScoring[selectedGame].win} pts, Loser gets {gameScoring[selectedGame].lose} pts
            </p>
          </div> */}

          <div className="mb-4 sm:mb-6 flex gap-2 sm:gap-4 bg-gray-50 p-2 rounded-lg">
            <button
              onClick={() => setInputMethod('code')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-md transition-colors text-xs sm:text-sm ${inputMethod === 'code'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Team Code</span>
              <span className="sm:hidden">Code</span>
            </button>
            <button
              onClick={() => setInputMethod('qr')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-md transition-colors text-xs sm:text-sm ${inputMethod === 'qr'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">QR Code</span>
              <span className="sm:hidden">QR</span>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {inputMethod === 'code' ? (
              // Team Code Input
              <div className="border-2 border-green-200 rounded-lg p-4 sm:p-6 bg-green-50">
                <label className="block text-xs sm:text-sm font-medium text-green-900 mb-2">
                  Winning Team (Enter Team Code)
                </label>
                <input
                  type="text"
                  value={winnerInput}
                  onChange={(e) => setWinnerInput(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter team code or name"
                />
              </div>
            ) : (
              // QR Code Scanner
              <div className="border-2 border-green-200 rounded-lg p-4 sm:p-6 bg-green-50">
                <label className="block text-xs sm:text-sm font-medium text-green-900 mb-3">
                  Winning Team (Scan QR Code)
                </label>

                {/* QR Scanner Area */}
                <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-6 sm:p-8 mb-3">
                  <div className="flex flex-col items-center justify-center text-center">
                    <QrCode className="h-16 w-16 sm:h-20 sm:w-20 text-green-400 mb-3" />
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Position QR code within the frame
                    </p>
                    <button
                      onClick={handleQRScan}
                      className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      Start Scanning
                    </button>
                  </div>
                  {/* TODO: Add QR scanner library component here */}
                  {/* Example: <QrReader onScan={handleScan} onError={handleError} /> */}
                </div>

                {/* Display scanned result */}
                {winnerInput && (
                  <div className="bg-green-100 border border-green-300 rounded-md p-3">
                    <p className="text-xs sm:text-sm text-green-900">
                      <span className="font-medium">Scanned: </span>
                      {winnerInput}
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleScoreSubmit}
              className="w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
            >
              Record Score
            </button>
          </div>

          {/* {matchHistory.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Recent Matches</h3>
              <div className="space-y-3">
                {matchHistory.slice().reverse().map((match) => (
                  <div key={match.id} className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">{match.game}</p>
                        <p className="text-sm sm:text-base text-gray-900">
                          <span className="font-semibold text-green-600">{match.winner}</span>
                          <span className="text-green-700 text-xs sm:text-sm"> (+{match.winnerPoints})</span>
                          {' vs '}
                          <span className="text-red-600">{match.loser}</span>
                          <span className="text-red-700 text-xs sm:text-sm"> ({match.loserPoints})</span>
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">{match.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>
  )
}

export default Scoring