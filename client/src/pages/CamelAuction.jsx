import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import { teamRegister } from "../apis/user.api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { Trophy, Hash } from "lucide-react";
import CamelRacing from '../components/CamelRacing';
import AuctionGame from '../components/AuctionGame';

const CamelAuction = () => {
  const [selectedGame, setSelectedGame] = useState("camel");
  const [inputMethod, setInputMethod] = useState("code");
  const [winnerInput, setWinnerInput] = useState("");
  const [finalPoints, setFinalPoints] = useState([]);

  const handlePointsCalculated = (points) => {
    setFinalPoints(points);
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Record Score</h2>
            </div>

            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border rounded-md text-sm text-black"
            >
              <option value="camel">Camel Racing</option>
              <option value="auction">Auction Game</option>
            </select>
          </div>

          {selectedGame === "camel" && (
            <CamelRacing onPointsCalculated={handlePointsCalculated} />
          )}

          {selectedGame === "auction" && (
            <AuctionGame onPointsCalculated={handlePointsCalculated} />
          )}

          {finalPoints.length > 0 && (
            <div className="mt-8 text-sm text-center text-gray-700">
              ✅ Points ready to send to API
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CamelAuction;
