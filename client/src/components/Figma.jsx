import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // menu icons

const Figma = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const routes = [
    { name: "Wordle", path: "/games/wordle" },
    { name: "Simon Says", path: "/games/simon_says" },
    { name: "Flappy Bird", path: "/games/flappy_bird" },
  ];

  return (
    <div
      className="w-full h-screen bg-cover flex flex-col relative overflow-hidden"
      style={{ backgroundImage: "url('/bg_img.jpg')" }}
    >
      {/* Overlay */}
      <div
        className="absolute w-full h-full"
        style={{
          background: 'radial-gradient(circle 10000px, #02020C42, #0A0400)',
        }}
      ></div>

      {/* Menu Button (always visible) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-5 right-5 z-200 text-[#ffda34] cursor-pointer"
      >
        {sidebarOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-[#000000]/50 border-l-2 border-[#ffda34]/40 
        flex flex-col items-end text-[#ffda34] font-cinzel text-lg backdrop-blur-sm
        transform transition-transform duration-300 ease-in-out z-100 shadow-2xl
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} 
        w-64 px-6 py-20`}
      >
        <div className="flex flex-col gap-5 w-full">
          {routes.map((r) => (
            <button
              key={r.name}
              onClick={() => {
                setSidebarOpen(false);
                navigate(r.path);
              }}
              className="text-center px-3 py-2 border border-transparent rounded-full 
                hover:text-black hover:bg-[#ffda34] hover:shadow-[0_0_15px_#ffda34] 
                transition-all duration-150 ease-in-out cursor-pointer font-bold"
            >
              {r.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-grow justify-center items-center z-10 text-white font-cinzel text-center 
          transform transition-all duration-1000 px-4
          ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="tracking-wider text-xl md:text-2xl lg:text-3xl mb-6 !font-arabian drop-shadow-[0_0_8px_#ffffff]">
          DIVE DEEP INTO THE REALMS OF MAGIC, MYSTERY & SPLENDOR
        </div>

        <div className="text-[66px] md:text-[80px] lg:text-[165px] font-black text-[#ffda34] mb-5 drop-shadow-[0_0_8px_#ffda34]">
          CELESTIA
        </div>
        <div className="text-3xl mb-16 !font-arabian drop-shadow-[0_0_8px_#ffffff]">ARABIAN NIGHTS</div>

        {/* Main Button */}
        <button
          className="relative px-10 py-3 text-lg md:text-xl font-semibold bg-[#00000098]
            border-2 border-[#ffda34] text-[#ffda34] rounded-full overflow-hidden cursor-pointer
            group transition duration-300 hover:text-black hover:shadow-[0_0_25px_#ffda34]"
          onClick={() => navigate('/leaderboard')}
        >
          <span className="absolute inset-0 bg-[#ffda34] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-150 ease-out"></span>
          <span className="relative z-10">Enter the Realm</span>
        </button>
      </div>
    </div>
  );
};

export default Figma;
