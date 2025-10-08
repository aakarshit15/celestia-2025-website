import { useState } from "react";
import { Trophy } from "lucide-react";

const AdminBulk = ({ handleSubmit }) => {
  const [teams, setTeams] = useState([
    { teamId: "", scoreToAdd: "" },
    { teamId: "", scoreToAdd: "" },
  ]);

  const addTeam = () => {
    const updated = [...teams];
    updated.push({ teamId: "", scoreToAdd: "" });
    setTeams(updated);
  };

  const handleInputChange = (teamIndex, teamId, scoreToAdd) => {
    const updated = [...teams];
    updated[teamIndex] = {
      teamId: teamId,
      scoreToAdd: scoreToAdd,
    };
    setTeams(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Bulk Edit</h2>
      </div>

      <div className="flex flex-row gap-5">
        <button
          onClick={() => addTeam()}
          className="text-lg bg-indigo-600 text-white hover:underline px-4 py-1 rounded-2xl mb-5 cursor-pointer"
        >
          + Add Team
        </button>
        <button
          onClick={() => handleSubmit(teams)}
          className="text-lg bg-green-600 text-white hover:underline px-4 py-1 rounded-2xl mb-5 cursor-pointer"
        >
          Submit
        </button>
      </div>

      {/* Team Inputs */}
      {teams.map((team, teamIndex) => (
        <div
          key={teamIndex + 1}
          className="border-2 border-yellow-200 rounded-lg p-4 mb-4 bg-yellow-50"
        >
          <h3 className="font-semibold text-yellow-900 mb-2">
            Team {teamIndex + 1}
          </h3>
          <div key={teamIndex} className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              value={team.teamId}
              onChange={(e) =>
                handleInputChange(teamIndex, e.target.value, team.scoreToAdd)
              }
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              placeholder="Team ID"
            />
            <input
              type="text"
              value={team.scoreToAdd}
              onChange={(e) =>
                handleInputChange(teamIndex, team.teamId, e.target.value)
              }
              className="w-40 px-3 py-2 border rounded-md text-sm"
              placeholder="Score To Add"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBulk;
