import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import ltext from "../assets/ltext.png"; // top image
import genie from "../assets/genie.png"; // <-- Genie Image
import axios from "axios";
import Cookies from "js-cookie";
import { teamProgress } from "../apis/leaderboard.api";
import { useNavigate } from "react-router-dom";

// Animation settings
const HEADER_DURATION = 0.8;
const HEADER_EASING = [0.25, 0.1, 0.25, 1];
const tableDropInProps = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};
const genieVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const ParticipantHistory = () => {
  const [participantData, setParticipantData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamData, setTeamData] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const fetchParticipantHistory = async () => {
    console.log("In participant history");
    try {
      const teamId = Cookies.get("teamId");
      setLoggedIn(!!teamId);
      console.log("TeamId: ", teamId);

      const response = await axios.get(`${teamProgress}/${teamId}`);
      console.log("Participant history response:", response.data);

      setParticipantData(response.data.data.gameStatistics);
      setTableData(response.data.data.gameStatistics);
      setTeamData(response.data.data);
      // setTotalPoints(response.data.data.totalPoints);
      // console.log("Team Data:", response.data.data.teamName);
      // setTableData(res.data.history);
    } catch (error) {
      console.error("Error fetching participant history:", error);
    }
  };

  useEffect(() => {
    fetchParticipantHistory();
  }, []);

  const filteredData = tableData.filter((game) =>
    game.gameName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full inset-x-0 flex flex-col items-center bg-cover bg-center relative overflow-x-hidden"
      style={{ backgroundImage: `url('/bg2.jpg')` }}
    >
      {/* Back button */}
      <motion.div
        className="absolute top-6 right-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0,
          duration: HEADER_DURATION,
          ease: HEADER_EASING,
        }}
      >
        <Button textBefore="Back" textAfter="Back" onClick={() => navigate('/leaderboard')} />
      </motion.div>

      {/* Top banner */}
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ffe066] text-center mt-32 sm:mt-20 z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0,
          duration: HEADER_DURATION,
          ease: HEADER_EASING,
        }}
      >
        {teamData.teamName}
      </motion.h2>

      <div className="mt-5 h-10 sm:h-8"></div>

      {/* Table Container */}
      <motion.div
        className="w-11/12 max-w-4xl lg:max-w-6xl rounded-xl p-4 sm:p-6 mb-10 bg-white/10 backdrop-blur-md border-4 border-[#d4af37] shadow-[0_0_20px_#d4af37] relative z-10"
        {...tableDropInProps}
      >
        {/* Genie Image */}
        <motion.img
          src={genie}
          alt="Genie"
          className="absolute -top-6 sm:-top-14 w-12 sm:w-28 md:w-40 -left-3 sm:-left-6 md:-left-10 h-auto z-0"
          variants={genieVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Team Header */}
        {participantData && (
          <div className="text-center text-[#ffe066] mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase">
              {participantData.teamName}
            </h2>
            <p className="text-lg sm:text-xl font-semibold mt-1">
              Total Points:{" "}
              <span className="text-[#ffe066]">{teamData.totalPoints}</span>
            </p>
          </div>
        )}

        {/* Search */}
        <div className="w-full px-4 sm:px-6 mb-4">
          <input
            type="text"
            placeholder="Search Game Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg border-2 border-[#d4af37] bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left font-light border-collapse">
            <thead className="font-semibold text-[#f8e58c] uppercase border-b-2 border-[#d4af37] text-sm sm:text-lg tracking-wide">
              <tr className="bg-[#2b1a00]/70">
                <th className="px-3 py-3 border-r border-[#d4af37] rounded-tl-lg">#</th>
                <th className="px-3 py-3 border-r border-[#d4af37]">Game Name</th>
                <th className="px-3 py-3 border-r border-[#d4af37]">Game Points</th>
                <th className="px-3 py-3 border-r border-[#d4af37]">Times Played</th>
                <th className="px-3 py-3 rounded-tr-lg">Total Points Earned</th>
              </tr>
            </thead>
            <tbody>
              {!loggedIn ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-[#ffe066] italic"
                  >
                    Please Login First
                  </td>
                </tr>
              ) :
                filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-[#ffe066] italic"
                    >
                      No Game History Found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((game, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#d4af37]/60 text-white hover:bg-[#3b2600]/40 transition"
                    >
                      <td className="px-3 py-3 border-r border-[#d4af37]/40">
                        {index + 1}
                      </td>
                      <td className="px-3 py-3 border-r border-[#d4af37]/40">
                        {game.gameName}
                      </td>
                      <td className="px-3 py-3 border-r border-[#d4af37]/40">
                        {game.gamePoints === 1 ? '-' : game.gamePoints}
                      </td>
                      <td className="px-3 py-3 border-r border-[#d4af37]/40">
                        {game.timesCompleted}
                      </td>
                      <td className="px-3 py-3">{game.totalPointsEarned}</td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ParticipantHistory;
