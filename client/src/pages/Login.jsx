import React, { useState } from "react";
import Button from "./Button";
import bg from "../assets/leaderboard.png";
import regi from "../assets/regi.png"; // add top image

const Login = () => {
  const [teamName, setTeamName] = useState("");
  const [teamID, setTeamID] = useState("");

  const handleCreateTeam = () => {
    alert(`Team Created!\nName: ${teamName}\nID: ${teamID}`);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-start bg-cover bg-center relative pt-16"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back button */}
      <div className="absolute top-4 right-4">
        <Button to="/">Back</Button>
      </div>

      {/* Top Image */}
      <img src={regi} alt="Registration" className="w-2/3 sm:w-1/2 mt-4 mb-8" />

      {/* Participant Dashboard */}
      <div className="bg-white bg-opacity-80 p-10 rounded-2xl shadow-lg flex flex-col items-center space-y-4 w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Participant Login</h2>
        <input
          type="text"
          placeholder="Team Name"
          className="px-4 py-2 rounded border border-gray-300 w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Team ID"
          className="px-4 py-2 rounded border border-gray-300 w-full"
          value={teamID}
          onChange={(e) => setTeamID(e.target.value)}
        />
        <button className="arabian-btn w-full" onClick={handleCreateTeam}>
          Create Team
        </button>
      </div>
    </div>
  );
};

export default Login;

