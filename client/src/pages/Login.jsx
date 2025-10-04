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

  // --- ANIMATION CONSTANTS (UNCHANGED) ---
  const APPEARANCE_DELAY = 0.5;
  const DURATION = 1.0;
  const smoothEase = [0.34, 1.56, 0.64, 1];
  const commonTransition = {
    delay: APPEARANCE_DELAY,
    duration: DURATION,
    ease: smoothEase,
  };

  const dropInTransitionProps = {
    initial: { opacity: 0, y: -60, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      delay: APPEARANCE_DELAY,
      duration: DURATION + 0.3,
      ease: smoothEase,
    },
  };

  const slideInTransitionProps = {
    initial: { opacity: 0, x: -300 },
    animate: { opacity: 1, x: 0 },
    transition: { 
      ...commonTransition, 
      delay: APPEARANCE_DELAY + 0.2,
      duration: DURATION + 1.0,
    },
  };

  const backButtonTransitionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      delay: dropInTransitionProps.transition.delay, 
      duration: 0.5,
      ease: smoothEase,
    },
  };
  // --- END ANIMATION CONSTANTS ---

  // --- DIMENSIONS & SPACING & UPDATED COLORS ---
  const loginBoxWidth = 384;
  const baseCarpetWidth = 100;
  const lgCarpetWidth = 200;
  const gap = 40;

  // Primary Color: Base Gold
  const primaryColor = "#d4af37"; 
  // Secondary Color: DARK BLUE (Text Color & Button BG)
  const secondaryColor = "#023A5F"; 

  // SHADES
  // Login Box BG: Lighter Gold
  const boxBgColor = "#e0b95b"; 
  // Input BG: Lightest Gold
  const inputBgColor = "#f0d588"; 
  
  // Button Text/Outline Color (Must match Box BG color)
  const buttonTextColor = boxBgColor; 
  // Button BG Color (Must match Title Text color)
  const buttonBgColor = secondaryColor; 

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
  
  // Tailwind utility class for inputs
  const inputClass = `
    px-4 py-3 
    rounded-xl 
    border-2 
    w-full 
    focus:ring-1 
    transition duration-200
  `;

  // Custom style object for the Button component (Assuming it accepts this)
  const customButtonStyle = {
    backgroundColor: buttonBgColor,
    color: buttonTextColor,
    borderColor: buttonTextColor, // For the outline
    // Note: If your Button component uses Tailwind classes internally, 
    // you will need to modify the Button.jsx file instead of passing styles here.
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-start bg-cover bg-center relative pt-16 overflow-hidden"
      style={{ backgroundImage: `url('/bg2.jpg')` }}
    >
      {/* Back button (Updated to use the new color logic) */}
      <motion.div className="absolute top-4 right-4" {...backButtonTransitionProps}>
        {/* For the Back button, we'll use a simpler version, Gold text on Dark Blue background */}
        <Button 
          textBefore="Back" 
          textAfter="Back" 
          to="/"
          // Passing custom styles to ensure the color swap is applied
          style={{ 
            backgroundColor: secondaryColor,
            color: primaryColor,
            borderColor: primaryColor
          }}
        />
      </motion.div>

      {/* Top Image */}
      <motion.img
        src={regi}
        alt="Registration"
        className="w-2/3 sm:w-1/3 mt-4 mb-2.5"
        {...dropInTransitionProps}
      />

      {/* Center Section */}
      <div className="flex items-center justify-center flex-grow w-full relative mt-[-3rem]">
        {/* Magic Carpet */}
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

        {/* Login Box - LIGHTER LIGHTER GOLD BG */}
        <motion.div
          className="
            p-10 
            rounded-[3rem] 
            shadow-2xl 
            flex 
            flex-col 
            items-center 
            space-y-6 
            w-96
            border-4 
            transform 
            transition-transform 
            duration-300 
            hover:scale-[1.02]
            will-change-transform
            z-20
          "
          style={{ 
            backgroundColor: boxBgColor, // LIGHTER GOLD
            borderColor: secondaryColor // Dark Blue Border
          }}
          {...dropInTransitionProps}
        >
          {/* Title - DARK BLUE TEXT */}
          <h2 
            className="text-3xl font-extrabold mb-4 font-[Cinzel Decorative, serif] whitespace-nowrap"
            style={{ color: secondaryColor }}
          >
            Participant Login
          </h2>

          {/* Input 1 - LIGHTEST GOLD BG, DARK BLUE TEXT */}
          <input
            type="text"
            placeholder="Team Name"
            className={inputClass}
            style={{ 
              backgroundColor: inputBgColor, // LIGHTEST GOLD
              borderColor: secondaryColor,
              color: secondaryColor, // Dark Blue Text
            }}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          {/* Input 2 - LIGHTEST GOLD BG, DARK BLUE TEXT */}
          <input
            type="text"
            placeholder="Team ID"
            className={inputClass}
            style={{ 
              backgroundColor: inputBgColor, // LIGHTEST GOLD
              borderColor: secondaryColor,
              color: secondaryColor, // Dark Blue Text
            }}
            value={teamID}
            onChange={(e) => setTeamID(e.target.value)}
          />

          {/* Create Team Button - DARK BLUE BG, LIGHTER GOLD TEXT/OUTLINE */}
          <div> 
            <Button
              textBefore="Create"
              textAfter="Team"
              onClick={handleCreateTeam}
              to="#"
              style={customButtonStyle}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;