import React from "react";
import { Routes, Route } from "react-router-dom";
import GameSim from "./GameSim";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GameSim />} />
    </Routes>
  );
};

export default App;
