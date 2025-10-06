import React, { useState } from "react";
import { Trophy, Hash } from "lucide-react";
import { subtractPoints, changePoints } from "../apis/user.api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const AuctionGame = () => {
  const [boxes, setBoxes] = useState([
    { id: 1, teams: [{ code: "", bet: "" }] },
    { id: 2, teams: [{ code: "", bet: "" }] },
    { id: 3, teams: [{ code: "", bet: "" }] },
    { id: 4, teams: [{ code: "", bet: "" }] },
    { id: 5, teams: [{ code: "", bet: "" }] },
  ]);
  const [multipliers, setMultipliers] = useState(["", "", "", "", ""]);
  const [finalPoints, setFinalPoints] = useState([]);

  const addTeamToBox = (boxIndex) => {
    const updated = [...boxes];
    updated[boxIndex].teams.push({ code: "", bet: "" });
    setBoxes(updated);
  };

  const handleInputChange = (boxIndex, teamIndex, field, value) => {
    const updated = [...boxes];
    updated[boxIndex].teams[teamIndex][field] = value;
    setBoxes(updated);
  };

  const calculatePoints = async () => {
    const points = [];
    boxes.forEach((box, i) => {
      const multiplier = (Number(multipliers[i]) - 1) || 0;
      box.teams.forEach((t) => {
        points.push({
          teamCode: t.code,
          points: multiplier * Number(t.bet),
        });
      });
    });
    setFinalPoints(points);

    try {
      const token = Cookies.get('token');

      for (const p of points) {
        if (p.points !== 0) { // only call API if points != 0
          try {
            const response = await axios.post(
              changePoints,
              {
                teamId: p.teamCode,
                points: p.points,
                reason: "Points changed by admin via Auction Game",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(`Points updated for ${p.teamCode}:`, response.data);
          } catch (error) {
            console.error(`Error updating points for ${p.teamCode}:`, error);
          }
        } else {
          console.log(`Skipped ${p.teamCode} (0 points)`);
        }
      }

      toast.success("All points successfully updated!");
    } catch (error) {
      console.error("Error updating points:", error);
      toast.error("Some error occurred while updating points.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Auction Game</h2>
      </div>

      {/* Box Inputs */}
      {boxes.map((box, boxIndex) => (
        <div
          key={box.id}
          className="border-2 border-blue-200 rounded-lg p-4 mb-4 bg-blue-50"
        >
          <h3 className="font-semibold text-blue-900 mb-2">Box {box.id}</h3>
          {box.teams.map((team, teamIndex) => (
            <div
              key={teamIndex}
              className="flex flex-col sm:flex-row gap-2 mb-2"
            >
              <input
                type="text"
                value={team.code}
                onChange={(e) =>
                  handleInputChange(boxIndex, teamIndex, "code", e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                placeholder="Team Code"
              />
              <input
                type="text"
                value={team.bet}
                onChange={(e) =>
                  handleInputChange(boxIndex, teamIndex, "bet", e.target.value)
                }
                className="w-24 px-3 py-2 border rounded-md text-sm"
                placeholder="Bet"
              />
            </div>
          ))}
          <button
            onClick={() => addTeamToBox(boxIndex)}
            className="text-xs text-indigo-600 hover:underline"
          >
            + Add Team
          </button>
        </div>
      ))}

      {/* Multiplier Inputs */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">
          Enter Box Multipliers (0x, 0.5x, 1x, 1.5x, 2x)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {multipliers.map((m, i) => (
            <input
              key={i}
              type="text"
              step="0.5"
              value={m}
              onChange={(e) => {
                const updated = [...multipliers];
                updated[i] = e.target.value;
                setMultipliers(updated);
              }}
              className="px-3 py-2 border rounded-md text-sm"
              placeholder={`Box ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={calculatePoints}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Calculate Points
      </button>

      {finalPoints.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Calculated Points</h3>
          <ul className="space-y-1 text-sm">
            {finalPoints.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.teamCode}</span>:{" "}
                <span>{p.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuctionGame;
