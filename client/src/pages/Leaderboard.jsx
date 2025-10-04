import React from "react";
import Button from "./Button";
import ltext from "../assets/ltext.png"; // top image
import genie from "../assets/genie.png"; // <-- Import Genie image
import { motion } from "framer-motion"; // <-- Import motion for animations

const dummyLeaderboardData = [
  { rank: 1, teamName: "Power Puff Girls", members: 4, pointsBet: 200, score: 1240 },
  { rank: 2, teamName: "Only Comps", members: 3, pointsBet: 9, score: 1095 },
  { rank: 3, teamName: "Team Pookie", members: 5, pointsBet: 200, score: 1045 },
  { rank: 4, teamName: "Jedi Masters", members: 4, pointsBet: 9, score: 1025 },
  { rank: 5, teamName: "Cursed Coders", members: 2, pointsBet: 0, score: 990 },
  { rank: 6, teamName: "Terror Trio", members: 3, pointsBet: 200, score: 940 },
  { rank: 7, teamName: "Cod Crushers", members: 4, pointsBet: 9, score: 970 },
  { rank: 8, teamName: "The 3 Horsemen", members: 3, pointsBet: 9, score: 865 },
  { rank: 9, teamName: "Vaka Vaka", members: 4, pointsBet: 200, score: 855 },
  { rank: 10, teamName: "Bloodlust", members: 5, pointsBet: 200, score: 870 },
  { rank: 11, teamName: "Final Bosses", members: 3, pointsBet: 50, score: 820 },
  { rank: 12, teamName: "Alpha Geeks", members: 4, pointsBet: 0, score: 790 },
  { rank: 13, teamName: "Syntax Squad", members: 4, pointsBet: 150, score: 750 },
  { rank: 14, teamName: "Code Breakers", members: 2, pointsBet: 20, score: 720 },
  { rank: 15, teamName: "The Bug Hunters", members: 5, pointsBet: 100, score: 680 },
  { rank: 16, teamName: "Pixel Pioneers", members: 3, pointsBet: 0, score: 650 },
  { rank: 17, teamName: "Runtime Rascals", members: 4, pointsBet: 50, score: 610 },
  { rank: 18, teamName: "Data Destroyers", members: 4, pointsBet: 100, score: 580 },
  { rank: 19, teamName: "Logic Legends", members: 3, pointsBet: 0, score: 540 },
  { rank: 20, teamName: "Query Quenchers", members: 5, pointsBet: 50, score: 500 },
];

// Define common transition properties for synchronized header elements
const HEADER_DURATION = 0.8;
const HEADER_EASING = "easeOut";
const TABLE_DELAY = HEADER_DURATION + 0.2; // Table starts after headers finish

const Leaderboard = () => {
  
  // Animation for the entire Table Container (Drop down effect)
  const tableDropInProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: TABLE_DELAY,
      duration: 0.7, // Duration for the table drop-in
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
      className="h-screen w-screen flex flex-col items-center justify-start bg-cover bg-center relative overflow-y-auto"
      style={{ backgroundImage: `url('/bg2.jpg')` }}
    >
      {/* Back button - SYNCHRONIZED START */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
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

      {/* Top banner - SYNCHRONIZED START */}
      <motion.img
        src={ltext}
        alt="Top Banner"
        className="w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/3 mx-auto mt-2 mb-8 z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
            delay: 0, 
            duration: HEADER_DURATION, 
            ease: HEADER_EASING 
        }}
      />

      {/* Table Container - APPLYING DROP DOWN ANIMATION HERE */}
      <motion.div 
        className="w-11/12 max-w-7xl rounded-xl p-6 mb-10 bg-white/10 backdrop-blur-md border-4 border-[#d4af37] shadow-[0_0_20px_#d4af37] relative z-10"
        {...tableDropInProps}
      >
        
        {/* Genie Image - Absolute positioning relative to table container */}
        <motion.img
          src={genie}
          alt="Genie"
          className="absolute -top-20 -left-10 w-40 h-auto z-0" 
          variants={genieVariants}
          initial="hidden"
          animate="visible"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-left font-light border-collapse">
            <thead className="font-semibold text-[#f8e58c] uppercase border-b-2 border-[#d4af37] text-lg tracking-wide">
              <tr className="bg-[#2b1a00]/70">
                <th className="px-6 py-3 border-r border-[#d4af37] rounded-tl-lg">Rank</th>
                <th className="px-6 py-3 border-r border-[#d4af37]">Team Name</th>
                <th className="px-6 py-3 border-r border-[#d4af37]">Members</th>
                <th className="px-6 py-3 border-r border-[#d4af37]">Points Bet</th>
                <th className="px-6 py-3 rounded-tr-lg">Score</th>
              </tr>
            </thead>

            <tbody>
              {/* NO ANIMATION ON INDIVIDUAL ROWS */}
              {dummyLeaderboardData.map((team, index) => (
                <tr
                  key={index}
                  className={`border-b border-[#d4af37]/60 transition duration-300 ease-in-out text-white ${
                    team.rank <= 3
                      ? "text-xl font-extrabold text-[#ffe066] bg-[#3b2600]/60 hover:bg-[#5a3d00]/60"
                      : "text-lg hover:bg-[#3b2600]/40"
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-3 border-r border-[#d4af37]/50">
                    {team.rank}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 border-r border-[#d4af37]/50">
                    {team.teamName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 border-r border-[#d4af37]/50">
                    {team.members}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 border-r border-[#d4af37]/50">
                    {team.pointsBet}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-white font-semibold">
                    {team.score}{" "}
                    {team.rank <= 3 && (
                      <span role="img" aria-label="magic wand">🪄</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;