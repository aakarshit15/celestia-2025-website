import React, { useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Sky,
  Cloud,
} from "@react-three/drei";
import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";

import Leaderboard from "./pages/leaderboard";
import Login from "./pages/Login";
import Button from "./pages/Button";
import "./index.css";
import "./App.css";

import Simon_says from "./pages/games/simon_says/app.jsx";

import Scoring from "./pages/Scoring.jsx";
import Register from "./pages/register.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

// 3D Model Component
function Model() {
  const { scene, animations } = useGLTF("/arabian.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    Object.values(actions).forEach((action) => action.play());
  }, [actions]);

  useFrame((state, delta) => {
    scene.rotation.y += delta * 0.02;
  });

  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />;
}

// Home page (Arabian 3D + Links)
function Home() {
  return (
    <div className="w-screen h-screen relative">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-end p-4 z-20">
        <Button textBefore="Login" textAfter="Login" to="/login" />
      </nav>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 3, 12], fov: 45 }}>
          <Sky
            distance={450000}
            sunPosition={[1, 1, 0]}
            inclination={0.49}
            azimuth={0.25}
          />
          <Cloud
            position={[0, 10, -20]}
            opacity={0.5}
            speed={0.2}
            width={50}
            depth={1.5}
            segments={20}
          />
          <Cloud
            position={[-15, 12, -25]}
            opacity={0.4}
            speed={0.1}
            width={40}
            depth={1.2}
            segments={15}
          />
          <Cloud
            position={[20, 15, -30]}
            opacity={0.3}
            speed={0.15}
            width={60}
            depth={1.8}
            segments={25}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Model />
          <OrbitControls
            enablePan={true}
            enableZoom={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Overlay header */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <img
          src="/header.png"
          alt="Event Header"
          className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/3 mx-auto mb-6"
        />

        {/* Leaderboard Button */}
        <div className="pointer-events-auto mt-6">
          <Button textBefore="View" textAfter="Leaderboard" to="/leaderboard" />
        </div>

        {/* Simon Says Button */}
        <div className="pointer-events-auto mt-6">
          <Link
            to="/games/simon_says"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Play Simon Says
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main App with all routes merged
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
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/games/simon_says" element={<Simon_says />} />

        <Route path="/admin/login" element={<AdminLogin />} />
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
      </Routes>
    </>

  );
}
