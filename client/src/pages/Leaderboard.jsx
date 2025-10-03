import React from "react";
import { Link } from "react-router-dom";
import bg from "../assets/leaderboard.png"; // background
import ltext from "../assets/ltext.png";    // top image

const Leaderboard = () => {
  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-start bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back button at top-right */}
      <div className="absolute top-4 right-4">
        <Link to="/">
          <button className="arabian-btn">Back</button>
        </Link>
      </div>

      {/* Top overlay image closer to top */}
      <img
        src={ltext}
        alt="Top Banner"
        className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 mx-auto mt-2"
      />

     
    </div>
  );
};

export default Leaderboard;
