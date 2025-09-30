import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // or "./FlappyBird" if that’s your main component
import "./index.css"; // optional, your styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
