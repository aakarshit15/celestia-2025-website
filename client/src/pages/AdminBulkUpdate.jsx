import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import { teamRegister } from "../apis/user.api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Trophy, Hash } from "lucide-react";
import AdminBulk from "../components/AdminBulk";
import AuctionGame from "../components/AuctionGame";

const AdminBulkUpdate = () => {
  const [selectedGame, setSelectedGame] = useState("camel");

  const handleSubmit = async (teams) => {
    let updatedTeams = [...teams];
    for (let team of updatedTeams) {
      team.reason = "";
    }
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        {
          gameId:
            selectedGame === "camel"
              ? "68e41103d62ef35da105ea07"
              : "68e416481de29e0d724c5a57",
          updates: updatedTeams,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("sent bulk edit successfully");
      toast.success("sent bulk edit successfully");
    } catch (error) {
      console.error(`Error sending bulk edit: `, error);
      toast.error("Error sending bulk edit.");
    }
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

          <AdminBulk handleSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
};

export default AdminBulkUpdate;
