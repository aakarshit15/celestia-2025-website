import React, { useState, useEffect } from 'react'
import { Trophy, QrCode, Hash } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'

const Scoring = () => {
  const [teams, setTeams] = useState([])
  const [matchHistory, setMatchHistory] = useState([])
  const [selectedGame, setSelectedGame] = useState('Game A')
  const [inputMethod, setInputMethod] = useState('code')
  const [winnerInput, setWinnerInput] = useState('')
  const [loserInput, setLoserInput] = useState('')

  const gameScoring = {
    'Game A': { win: 10, lose: -2 },
    'Game B': { win: 15, lose: 0 },
    'Game C': { win: 20, lose: -5 },
    'Game D': { win: 25, lose: -3 }
  }

  const games = Object.keys(gameScoring)

  useEffect(() => {
    // Fetch teams and matches from backend
    // fetch('/api/teams').then(res => res.json()).then(data => setTeams(data))
    // fetch('/api/matches').then(res => res.json()).then(data => setMatchHistory(data))
  }, [])

  const handleScoreSubmit = async () => {
    if (!winnerInput || !loserInput) {
      alert('Please enter both teams')
      return
    }

    const winner = teams.find(t =>
      t.teamCode?.toLowerCase() === winnerInput.toLowerCase() ||
      t.teamName?.toLowerCase() === winnerInput.toLowerCase()
    )

    const loser = teams.find(t =>
      t.teamCode?.toLowerCase() === loserInput.toLowerCase() ||
      t.teamName?.toLowerCase() === loserInput.toLowerCase()
    )

    if (!winner || !loser) {
      alert('Invalid team code or name. Please check and try again.')
      return
    }

    if (winner.id === loser.id) {
      alert('Winner and loser cannot be the same team.')
      return
    }

    const scoring = gameScoring[selectedGame]
    const newMatch = {
      game: selectedGame,
      winnerId: winner.id,
      loserId: loser.id,
      winnerPoints: scoring.win,
      loserPoints: scoring.lose
    }

    try {
      // const response = await fetch('/api/matches', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newMatch)
      // })
      // const data = await response.json()

      const tempMatch = {
        id: Date.now(),
        ...newMatch,
        winner: winner.teamName,
        loser: loser.teamName,
        timestamp: new Date().toLocaleString()
      }
      setMatchHistory([...matchHistory, tempMatch])
      alert(`Score recorded! ${winner.teamName}: +${scoring.win} pts, ${loser.teamName}: ${scoring.lose} pts`)

      setWinnerInput('')
      setLoserInput('')
    } catch (error) {
      alert('Failed to record score')
    }
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
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              >
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 sm:mb-6 bg-indigo-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-indigo-900 font-medium">
              {selectedGame} Scoring: Winner gets +{gameScoring[selectedGame].win} pts, Loser gets {gameScoring[selectedGame].lose} pts
            </p>
          </div>

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
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"> */}
            <div className="border-2 border-green-200 rounded-lg p-4 sm:p-6 bg-green-50">
              <label className="block text-xs sm:text-sm font-medium text-green-900 mb-2">
                Winning Team {inputMethod === 'qr' ? '(Scan QR)' : '(Code/Name)'}
              </label>
              <input
                type="text"
                value={winnerInput}
                onChange={(e) => setWinnerInput(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                placeholder={inputMethod === 'qr' ? 'QR result' : 'Code or name'}
              />
            </div>

            {/* <div className="border-2 border-red-200 rounded-lg p-4 sm:p-6 bg-red-50">
              <label className="block text-xs sm:text-sm font-medium text-red-900 mb-2">
                Losing Team {inputMethod === 'qr' ? '(Scan QR)' : '(Code/Name)'}
              </label>
              <input
                type="text"
                value={loserInput}
                onChange={(e) => setLoserInput(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                placeholder={inputMethod === 'qr' ? 'QR result' : 'Code or name'}
              />
            </div> */}
            {/* </div> */}

            <button
              onClick={handleScoreSubmit}
              className="w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
            >
              Record Score
            </button>
          </div>

          {matchHistory.length > 0 && (
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
          )}
        </div>
      </div>
    </>
  )
}

export default Scoring