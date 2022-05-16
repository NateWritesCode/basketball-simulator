import { useQuery } from "@apollo/client";
import React from "react";
import { GET_LEAGUE_STANDINGS } from "../graphql";
import { getLeagueStandings } from "../types/getLeagueStandings";

const Standings = () => {
  const { data, error, loading } = useQuery<getLeagueStandings>(
    GET_LEAGUE_STANDINGS,
    {
      variables: { gameGroupId: 1, leagueId: 1 },
    }
  );

  console.log("data", data);
  console.log("error", error);
  console.log("loading", loading);
  return <div>Standings</div>;
};

export default Standings;
