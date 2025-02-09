import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import FallingBallGame from "./FallingBallGame";

function App() {
  return (
    <div className="grid place-items-center h-dvh bg-green-300">
      <FallingBallGame />
    </div>
  );
}

export default App;
