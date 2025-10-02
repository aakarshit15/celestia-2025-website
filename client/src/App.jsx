import { Routes, Route, Link } from "react-router-dom";
import Simon_says from "./pages/games/simon_says/app.jsx";
import "./App.css";

function Home() {

  return (
    <>
      <div className="card">
        <Link to="/games/simon_says" className="bg-red-500">Play Simon Says Game</Link>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games/simon_says" element={<Simon_says />} />
    </Routes>
  );
}

export default App;
