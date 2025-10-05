import React, { useState } from "react";
import { Trophy, Hash } from "lucide-react";

const CamelRacing = () => {
  const [camelBets, setCamelBets] = useState([
    { id: 1, teams: [{ code: "", bet: "" }] },
    { id: 2, teams: [{ code: "", bet: "" }] },
    { id: 3, teams: [{ code: "", bet: "" }] },
    { id: 4, teams: [{ code: "", bet: "" }] },
    { id: 5, teams: [{ code: "", bet: "" }] },
    { id: 6, teams: [{ code: "", bet: "" }] },
  ]);
  const [winners, setWinners] = useState({ first: "", second: "", third: "" });
  const [finalPoints, setFinalPoints] = useState([]);

  const addTeamToCamel = (camelIndex) => {
    const updated = [...camelBets];
    updated[camelIndex].teams.push({ code: "", bet: "" });
    setCamelBets(updated);
  };

  const handleInputChange = (camelIndex, teamIndex, field, value) => {
    const updated = [...camelBets];
    updated[camelIndex].teams[teamIndex][field] = value;
    setCamelBets(updated);
  };

  const calculatePoints = () => {
    const points = [];

    camelBets.forEach((camel, i) => {
      const camelNum = i + 1;
      let multiplier = 0;
      if (camelNum === Number(winners.first)) multiplier = 3;
      else if (camelNum === Number(winners.second)) multiplier = 2;
      else if (camelNum === Number(winners.third)) multiplier = 1;

      camel.teams.forEach((t) => {
        points.push({
          teamCode: t.code,
          points: multiplier * Number(t.bet),
        });
      });
    });

    setFinalPoints(points);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Camel Racing</h2>
      </div>

      {/* Camel Inputs */}
      {camelBets.map((camel, camelIndex) => (
        <div
          key={camel.id}
          className="border-2 border-yellow-200 rounded-lg p-4 mb-4 bg-yellow-50"
        >
          <h3 className="font-semibold text-yellow-900 mb-2">
            Camel {camel.id}
          </h3>
          {camel.teams.map((team, teamIndex) => (
            <div
              key={teamIndex}
              className="flex flex-col sm:flex-row gap-2 mb-2"
            >
              <input
                type="text"
                value={team.code}
                onChange={(e) =>
                  handleInputChange(camelIndex, teamIndex, "code", e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                placeholder="Team Code"
              />
              <input
                type="number"
                value={team.bet}
                onChange={(e) =>
                  handleInputChange(camelIndex, teamIndex, "bet", e.target.value)
                }
                className="w-24 px-3 py-2 border rounded-md text-sm"
                placeholder="Bet"
              />
            </div>
          ))}
          <button
            onClick={() => addTeamToCamel(camelIndex)}
            className="text-xs text-indigo-600 hover:underline"
          >
            + Add Team
          </button>
        </div>
      ))}

      {/* Winners Input */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">
          Enter Winning Camels
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            value={winners.first}
            onChange={(e) => setWinners({ ...winners, first: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-md text-sm"
            placeholder="1st Camel"
          />
          <input
            type="number"
            value={winners.second}
            onChange={(e) => setWinners({ ...winners, second: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-md text-sm"
            placeholder="2nd Camel"
          />
          <input
            type="number"
            value={winners.third}
            onChange={(e) => setWinners({ ...winners, third: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-md text-sm"
            placeholder="3rd Camel"
          />
        </div>
      </div>

      <button
        onClick={calculatePoints}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Start & Calculate Points
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

export default CamelRacing;
