import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import regi from "../assets/regi.png";
import carpet from "../assets/carpet.png";

const Login = () => {
  const [teamName, setTeamName] = useState("");
  const [teamID, setTeamID] = useState("");

  const handleCreateTeam = () => {
    alert(`Team Created!\nName: ${teamName}\nID: ${teamID}`);
  };

  // --- ANIMATION CONSTANTS ---
  const APPEARANCE_DELAY = 0.5;
  const DURATION = 1.0;

  // Soft, spring-like easing
  const smoothEase = [0.34, 1.56, 0.64, 1];

  // Shared transition for elements
  const commonTransition = {
    delay: APPEARANCE_DELAY,
    duration: DURATION,
    ease: smoothEase,
  };

  // Smooth Drop-in for login box and regi.png
  const dropInTransitionProps = {
    initial: { opacity: 0, y: -60, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      delay: APPEARANCE_DELAY,
      duration: DURATION + 0.3,
      ease: smoothEase,
    },
  };

  // Carpet slides in slightly later
  const slideInTransitionProps = {
    initial: { opacity: 0, x: -300 },
    animate: { opacity: 1, x: 0 },
    transition: { ...commonTransition, delay: APPEARANCE_DELAY + 0.2 },
  };

  // Back button fades in last
  const backButtonTransitionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      delay: APPEARANCE_DELAY + DURATION,
      duration: 0.5,
      ease: smoothEase,
    },
  };
  // --- END ANIMATION CONSTANTS ---

  // --- DIMENSIONS & SPACING ---
  const loginBoxWidth = 384;
  const baseCarpetWidth = 100;
  const lgCarpetWidth = 200;

  // Slight positive gap = “few words worth of space” between carpet and box
  const gap = 40;

  // Helper function to calculate carpet right position
  const calculateCarpetRightPosition = () => {
    return `calc(50% + ${loginBoxWidth / 2 + gap}px)`;
  };

  const carpetStyle = {
    width: `${baseCarpetWidth}px`,
    right: calculateCarpetRightPosition(),
    top: "17%",
    transform: "translateY(-50%)",
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-start bg-cover bg-center relative pt-16 overflow-hidden"
      style={{ backgroundImage: `url('/bg2.jpg')` }}
    >
      {/* Back button - Appears last */}
      <motion.div className="absolute top-4 right-4" {...backButtonTransitionProps}>
        <Button textBefore="Back" textAfter="Back" to="/" />
      </motion.div>

      {/* Top Image - Uses Drop-In Animation */}
      <motion.img
        src={regi}
        alt="Registration"
        className="w-2/3 sm:w-1/3 mt-4 mb-2.5"
        {...dropInTransitionProps}
      />

      {/* Center Section */}
      <div className="flex items-center justify-center flex-grow w-full relative mt-[-3rem]">
        {/* Magic Carpet - Slides in smoothly */}
        <motion.img
          src={carpet}
          alt="Magic Carpet"
          className="hidden lg:block h-auto z-10 absolute carpet-lg-size"
          style={carpetStyle}
          {...slideInTransitionProps}
        />

        <style jsx>{`
          @media (min-width: 1024px) {
            .carpet-lg-size {
              width: ${lgCarpetWidth}px !important;
              right: ${calculateCarpetRightPosition()} !important;
            }
          }
        `}</style>

        {/* Login Box - Now buttery smooth */}
        <motion.div
          className="
            bg-white 
            bg-opacity-90 
            p-10 
            rounded-[3rem] 
            shadow-2xl 
            flex 
            flex-col 
            items-center 
            space-y-6 
            w-96
            border-4 
            border-[#d4af37] 
            transform 
            transition-transform 
            duration-300 
            hover:scale-[1.02]
            will-change-transform
            z-20
          "
          {...dropInTransitionProps}
        >
          <h2 className="text-3xl font-extrabold text-[#d4af37] mb-4 font-[Cinzel Decorative, serif] whitespace-nowrap">
            Participant Login
          </h2>

          <input
            type="text"
            placeholder="Team Name"
            className="px-4 py-3 rounded-xl border-2 border-gray-400 w-full focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition duration-200"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Team ID"
            className="px-4 py-3 rounded-xl border-2 border-gray-400 w-full focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition duration-200"
            value={teamID}
            onChange={(e) => setTeamID(e.target.value)}
          />

          <div>
            <Button
              textBefore="Create"
              textAfter="Team"
              onClick={handleCreateTeam}
              to="#"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
