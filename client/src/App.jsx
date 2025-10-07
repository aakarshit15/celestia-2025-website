import { React, useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import Leaderboard from "./pages/Leaderboard.jsx";
import Login from "./pages/Login";
import Button from "./pages/Button";
import "./index.css";
import "./App.css";
import Simon_says from "./pages/games/simon_says/app.jsx";
import WordleArabian from "./pages/games/wordle/wordle.jsx";
import Scoring from "./pages/Scoring.jsx";
import Register from "./pages/register.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import CamelAuction from "./pages/CamelAuction.jsx";
import ParticipantHistory from "./pages/ParticipantHistory.jsx";
import Cookies from "js-cookie";
import Figma from "./components/Figma.jsx";
import FlappyBird from "./pages/games/flappy_bird/Flappybird.jsx";

// Define the appearance timing
const APPEARANCE_DELAY = 1.0;
const APPEARANCE_DURATION = 1.0;
const FLOAT_DELAY = APPEARANCE_DELAY;

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("teamId");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  // Base entrance animation properties (for simple fade-in)
  // Used for Navbar, Buttons, and Subheading
  const entranceTransitionProps = {
    initial: { opacity: 0 }, // Start invisible
    animate: { opacity: 1 },
    transition: {
      delay: APPEARANCE_DELAY,
      duration: APPEARANCE_DURATION,
      ease: "easeOut",
    },
  };

  // Drop-down animation properties (for Genie and Header)
  const dropInTransitionProps = {
    initial: { opacity: 0, y: -50 }, // Start invisible and 50px higher
    animate: { opacity: 1, y: 0 }, // End visible and at its intended vertical position
    transition: {
      delay: APPEARANCE_DELAY, // Use the same delay as other elements
      duration: APPEARANCE_DURATION,
      ease: "easeOut",
    },
  };

  // Floating loop properties (applied only to the Genie's image tag)
  const floatProps = {
    animate: { y: [0, -15, 0] }, // float effect
    transition: {
      delay: FLOAT_DELAY,
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Define Genie size and use it for the spacer to maintain center alignment
  const genieSizeClasses = "w-[55rem] lg:w-[65rem]";

  return (
    <div
      className="w-screen h-screen relative bg-cover bg-center overflow-y-scroll"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      {/* Navbar - Uses simple fade-in */}
      <motion.nav
        className="absolute top-0 left-0 w-full flex justify-end p-4 z-30"
        {...entranceTransitionProps}
      >
        <motion.div>
          {/* {loggedIn && (
            <Button textBefore="Leaderboard" textAfter="Leaderboard" onClick={() => navigate('/leaderboard')}
            />
          )} */}
          {!loggedIn && (
            <Button
              textBefore="Login"
              textAfter="Login"
              onClick={() => navigate("/login")}
            />
          )}
        </motion.div>
      </motion.nav>

      {/* MAIN SCROLLABLE CONTENT CONTAINER */}
      <div className="flex flex-col items-center justify-center w-full min-h-[200vh] z-20 pointer-events-none pt-[5rem]">
        {/* Genie & Header Section */}
        <div className="flex items-center justify-center w-full max-w-8xl p-4 flex-shrink-0">
          {/* Left Genie (Floats) - Uses drop-down animation */}
          <motion.div
            className="z-10 mr-0 pointer-events-auto"
            {...dropInTransitionProps}
          >
            <motion.img
              src="/g1.png"
              alt="Genie Left"
              className={genieSizeClasses}
              style={{ filter: "drop-shadow(0 0 15px rgba(0,0,0,0.5))" }}
              {...floatProps}
            />
          </motion.div>

          {/* Header Image (HUGE) - Uses drop-down animation */}
          <motion.img
            src="/header.png"
            alt="Website Heading"
            className="w-full max-w-none lg:w-[120%] xl:w-[150%] 2xl:w-[170%]"
            {...dropInTransitionProps}
          />

          {/* Invisible Spacer (Symmetry Restored) */}
          <motion.div className={`${genieSizeClasses} ml-0`} />
        </div>

        {/* Leaderboard Button - Uses simple fade-in */}
        {/* <motion.div
          className="mt-10 pointer-events-auto"
          {...entranceTransitionProps}
        >
          <Button textBefore="View" textAfter="Leaderboard" onClick={() => navigate('/leaderboard')}
            fullSlide={true} />
        </motion.div> */}

        {/* SUBHEADING IMAGE - Uses simple fade-in */}
        <motion.div
          className="mt-6 pointer-events-auto"
          {...entranceTransitionProps}
        >
          <img
            src="/sub.png"
            alt="Subheading"
            className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl"
          />
        </motion.div>

        {/* Spacer to push the Simon Says button far down. */}
        <div className="h-[75vh]"></div>

        {/* Simon Says Button - Uses simple fade-in */}
        <motion.div
          className="pointer-events-auto"
          {...entranceTransitionProps}
        >
          <Link
            to="/games/simon_says"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Play Simon Says
          </Link>
        </motion.div>

        {/* Bottom spacer to allow the Simon Says button to scroll into view */}
        <div className="h-[20vh]"></div>
      </div>
    </div>
  );
}

// Main App with routes
export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teamprogress" element={<ParticipantHistory />} />
        <Route path="/games/simon_says" element={<Simon_says />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/figma" element={<Figma />}></Route>
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute
              element={Register}
              allowedRoles={["admin", "superadmin"]}
            />
          }
        />
        <Route
          path="/admin/scoring"
          element={
            <ProtectedRoute
              element={Scoring}
              allowedRoles={["admin", "superadmin"]}
            />
          }
        />
        <Route
          path="/admin/camelauction"
          element={
            <ProtectedRoute
              element={CamelAuction}
              allowedRoles={["admin", "superadmin"]}
            />
          }
        />
      </Routes> */}
      <Routes>
        <Route path="/" element={<Figma />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teamprogress" element={<ParticipantHistory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/figma" element={<Figma />}></Route>
        <Route path="/games/wordle" element={<WordleArabian />} />
        <Route path="/games/simon_says" element={<Simon_says />} />
        <Route path="/games/flappy_bird" element={<FlappyBird />}></Route>
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute
              element={Register}
              allowedRoles={["admin", "superadmin"]}
            />
          }
        />
        <Route
          path="/admin/scoring"
          element={
            <ProtectedRoute
              element={Scoring}
              allowedRoles={["admin", "superadmin"]}
            />
          }
        />
        <Route
          path="/admin/camelauction"
          element={
            <ProtectedRoute
              element={CamelAuction}
              allowedRoles={["admin", "superadmin"]}
            />
          }
        />
      </Routes>
    </>
  );
}
