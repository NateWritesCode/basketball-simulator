import React from "react";
import { Routes, Route } from "react-router-dom";
import SqlSandbox from "./components/SqlSandbox";
import Flow from "./flow/Flow";
import Game from "./game/Game";
import GameSim from "./GameSim";
import Player from "./player/Player";
import Team from "./team/Team";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GameSim />} />
      <Route path="/flow" element={<Flow />} />
      <Route path="/game/:id" element={<Game />} />
      <Route path="/player/:slug" element={<Player />} />
      <Route path="/team/:abbrev" element={<Team />} />
      <Route path="/sql-sandbox" element={<SqlSandbox />} />
    </Routes>
  );
};

export default App;
