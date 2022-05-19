import { useQuery } from "@apollo/client";
import React from "react";
import { GET_LEAGUE_STANDINGS } from "../graphql";
import {
  getLeagueStandings,
  getLeagueStandings_getLeagueStandings_teams,
} from "../types/getLeagueStandings";
import PageLoader from "../components/PageLoader";
import PageError from "../components/PageError";
import PageNoDataFound from "../components/PageNoDataFound";
import { groupBy } from "lodash";
import { Box, Flex, VStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Standings = () => {
  const navigate = useNavigate();
  const { data, error, loading } = useQuery<getLeagueStandings>(
    GET_LEAGUE_STANDINGS,
    {
      variables: { gameGroupId: 1, leagueId: 1 },
    }
  );

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  if (!data || !data.getLeagueStandings) {
    return <PageNoDataFound />;
  }

  console.log("data", data);

  const { league, teams } = data.getLeagueStandings;

  let hasConferences = Boolean(league.conferences);
  let hasDivisions = Boolean(league.divisions);

  let teamGroups: any = null;

  if (hasDivisions) {
    teamGroups = groupBy(teams, "divisionId");
  } else if (hasConferences) {
    teamGroups = groupBy(teams, "conferenceId");
  }

  return (
    <Box mx="2">
      <Box>{league.name}</Box>
      {hasConferences && hasDivisions ? (
        <Box>
          {league.conferences!.map((conference, i) => {
            return (
              <Box key={i} my="4">
                {conference.name}
                <Flex>
                  {conference.divisions!.map((division, i) => {
                    let teams: getLeagueStandings_getLeagueStandings_teams[] =
                      teamGroups[division.id];
                    teams = teams.sort((teamA, teamB) => {
                      const aGamesPlayed = teamA.w + teamA.l;
                      const bGamesPlayed = teamB.w + teamB.l;
                      const aWinningPercentage = teamA.w / aGamesPlayed;
                      const bWinningPercentage = teamB.w / bGamesPlayed;

                      if (aWinningPercentage > bWinningPercentage) {
                        return -1;
                      } else if (aWinningPercentage < bWinningPercentage) {
                        return 1;
                      }

                      if (aGamesPlayed > bGamesPlayed) {
                        return -1;
                      } else if (aGamesPlayed < bGamesPlayed) {
                        return 1;
                      }

                      return 0;
                    });

                    return (
                      <Box key={i} mx="8">
                        <Box>{division.name}</Box>
                        <VStack align={"left"}>
                          {teams.map((team, i) => {
                            return (
                              <Box
                                key={i}
                                onClick={() => navigate(`/team/${team.abbrev}`)}
                                cursor="pointer"
                              >
                                <Image
                                  maxW={10}
                                  src={`https://cdn.nba.com/logos/nba/${team.id}/primary/L/logo.svg`}
                                />{" "}
                                <Box>
                                  {team.abbrev} - {team.w} - {team.l}
                                </Box>
                              </Box>
                            );
                          })}
                        </VStack>
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
            );
          })}
        </Box>
      ) : hasDivisions ? (
        <Box>Has Divisions only</Box>
      ) : (
        <Box>Has only teams</Box>
      )}
    </Box>
  );
};

export default Standings;
