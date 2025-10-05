import { React, useState, useEffect } from "react";
import Button from "./Button";
import ltext from "../assets/ltext.png"; // top image
import genie from "../assets/genie.png"; // <-- Genie Image
import { motion } from "framer-motion"; // <-- Import motion for animations
import { getLeaderboard } from "../apis/leaderboard.api";
import axios from "axios";

// Animation constants
const HEADER_DURATION = 0.8;
const HEADER_EASING = "easeOut";
const TABLE_DELAY = HEADER_DURATION + 0.2;

const Leaderboard = () => {

  const [leaderboard, setLeaderboard] = useState(
    JSON.parse(localStorage.getItem("leaderboard")) || []
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered leaderboard based on search
  const filteredLeaderboard = leaderboard.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(getLeaderboard);
        const data = await response.data.data;
        console.log("Fetched leaderboard data:", data);

        // update only if data changed
        if (JSON.stringify(data) !== JSON.stringify(leaderboard)) {
          setLeaderboard(data);
          localStorage.setItem("leaderboard", JSON.stringify(data));
        }
      } catch (error) {
        console.log("Error in fetching leaderboard: ", error);
      }
    };

    // first fetch immediately
    fetchLeaderboard();

    // poll every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [leaderboard]);


  // Animation for the entire Table Container (Drop down effect)
  const tableDropInProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: TABLE_DELAY,
      duration: 0.7,
      ease: "easeOut",
    },
  };

  // Animation for Genie to slide in from left and float
  const genieVariants = {
    hidden: { opacity: 0, x: -100, y: 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: [0, -10, 0], // Floats up and down slightly
      transition: {
        x: { duration: 0.8, ease: "easeOut", delay: 0.5 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.8, delay: 0.5 },
      },
    },
  };

  return (
    <div
      // CRITICAL: Now using flex-col and overflow-x-hidden for vertical stacking safety
      className="min-h-screen w-full inset-x-0 flex flex-col items-center bg-cover bg-center relative overflow-x-hidden"
      style={{ backgroundImage: `url('/bg2.jpg')` }}
    >
      {/* Back button CONTAINER - Positioned absolutely to avoid affecting the main flow */}
      <motion.div
        className="absolute top-6 right-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0,
          duration: HEADER_DURATION,
          ease: HEADER_EASING
        }}
      >
        <Button textBefore="Back" textAfter="Back" to="/" />
      </motion.div>

      {/* Top banner - Ensures ample space above and below */}
      <motion.img
        src={ltext}
        alt="Top Banner"
        // Increased top margin for clearance
        className="w-4/5 sm:w-1/2 md:w-2/5 lg:w-1/3 mx-auto mt-20 sm:mt-8 z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0,
          duration: HEADER_DURATION,
          ease: HEADER_EASING
        }}
      />

      {/* Dynamic SPACER to push the table down on small screens */}
      {/* This ensures the Banner and Table never touch */}
      <div className="h-10 sm:h-8"></div>


      {/* Table Container - Now sits lower in the flex flow */}
      <motion.div
        className="w-11/12 max-w-4xl lg:max-w-7xl rounded-xl p-4 sm:p-6 mb-10 bg-white/10 backdrop-blur-md border-4 border-[#d4af37] shadow-[0_0_20px_#d4af37] relative z-10"
        {...tableDropInProps}
      >

        {/* Genie Image - Small and positioned safely on mobile */}
        <motion.img
          src={genie}
          alt="Genie"
          className="absolute -top-6 sm:-top-14 w-12 sm:w-28 md:w-40 -left-3 sm:-left-6 md:-left-10 h-auto z-0"
          variants={genieVariants}
          initial="hidden"
          animate="visible"
        />

        <div className="w-full px-4 sm:px-6 mb-4">
          <input
            type="text"
            placeholder="Search By Team Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg border-2 border-[#d4af37] bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          />
        </div>

        <div className="overflow-x-auto">
          {/* Table content scrolls horizontally on mobile via overflow-x-auto */}
          <table className="min-w-full text-left font-light border-collapse">
            <thead className="font-semibold text-[#f8e58c] uppercase border-b-2 border-[#d4af37] text-sm sm:text-lg tracking-wide">
              <tr className="bg-[#2b1a00]/70">
                <th className="px-3 py-3 border-r border-[#d4af37] rounded-tl-lg">Rank</th>
                <th className="px-3 py-3 border-r border-[#d4af37]">Team Name</th>
                {/* Score - Shows as 3rd column on mobile */}
                <th className="px-3 py-3 border-r border-[#d4af37] sm:hidden">Score</th>
                <th className="px-3 py-3 border-r border-[#d4af37]">Members</th>
                <th className="px-3 py-3 border-r border-[#d4af37] sm:border-r-0">Points Bet</th>
                {/* Score - Shows as last column on desktop */}
                <th className="hidden sm:table-cell px-3 py-3 rounded-tr-lg">Score</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaderboard.length <= 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-[#ffe066] italic z-100"
                  >
                    No teams to display
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((team, index) => (
                  <tr
                    key={index}
                    className={`border-b border-[#d4af37]/60 transition duration-300 ease-in-out text-white ${team.rank <= 3
                      ? "text-base sm:text-xl font-extrabold text-[#ffe066] bg-[#3b2600]/60 hover:bg-[#5a3d00]/60"
                      : "text-sm sm:text-lg hover:bg-[#3b2600]/40"
                      }`}
                  >
                    <td className="whitespace-nowrap px-3 py-3 border-r border-[#d4af37]/50">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 border-r border-[#d4af37]/50">
                      {team.teamName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 border-r border-[#d4af37]/50 sm:hidden text-white font-semibold">
                      {team.totalPoints}{" "}
                      {index < 3 && (
                        <span role="img" aria-label="magic wand">
                          🪄
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 border-r border-[#d4af37]/50">
                      {team.teamSize}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 border-r border-[#d4af37]/50">
                      {team.pointsBet}
                    </td>
                    <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3 text-white font-semibold">
                      {team.totalPoints}{" "}
                      {index < 3 && (
                        <span role="img" aria-label="magic wand">
                          🪄
                        </span>
                      )}
                    </td>
                  </tr>
                )))
              }
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;