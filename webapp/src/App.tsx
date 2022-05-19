import React from "react";
import { Routes, Route } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import LeagueStandings from "./league-standings/LeagueStandings";
import Player from "./player/Player";
import Simulation from "./simulation/Simulation";
import Team from "./team/Team";

const App = () => {
  return (
    <PageWrapper>
      <Routes>
        <Route path="/" element={<Simulation />} />
        <Route path="/league-standings" element={<LeagueStandings />} />
        <Route path="/player/:slug" element={<Player />} />
        <Route path="/team/:abbrev" element={<Team />} />
      </Routes>
    </PageWrapper>
  );
};

export default App;
