import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeBtn = ({ type="right" }) => {
  let navigate = useNavigate();
  return (
    <div>
      <div
        className={`fixed top-10 p-3 bg-gradient-to-br from-[#ffae00] to-[#ffd700]
          text-black shadow-[0_0_15px_rgba(255,215,0,0.6)] hover:-translate-y-0.5
          hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] rounded-xl z-1000 cursor-pointer
          transition duration-100 hidden sm:block ${type==="right"?"right-10":"left-10"}`}
        onClick={() => navigate("/")}
      >
        <Home className="w-10 h-10" />
      </div>
    </div>
  );
};

export default HomeBtn;
