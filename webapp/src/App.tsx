import React from "react";
import { Routes, Route } from "react-router-dom";
import LeagueStandings from "./league-standings/LeagueStandings";
import Simulation from "./simulation/Simulation";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Simulation />} />
      <Route path="/league-standings" element={<LeagueStandings />} />
    </Routes>
  );
};

export default App;
