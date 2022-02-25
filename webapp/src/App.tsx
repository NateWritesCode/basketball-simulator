import React from "react";
import { Routes, Route } from "react-router-dom";
import Game from "./game/Game";
import GameSim from "./GameSim";
import Player from "./player/Player";
import Team from "./team/Team";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GameSim />} />
      <Route path="/game/:id" element={<Game />} />
      <Route path="/player/:slug" element={<Player />} />
      <Route path="/team/:abbrev" element={<Team />} />
    </Routes>
  );
};

export default App;
