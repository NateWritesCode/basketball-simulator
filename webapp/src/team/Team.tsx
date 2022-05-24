import { useQuery } from "@apollo/client";
import { Box, Container, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import PageError from "../components/PageError";
import PageLoader from "../components/PageLoader";
import PageNoDataFound from "../components/PageNoDataFound";
import { GET_TEAM_INFO } from "../graphql";
import { getTeamInfo } from "../types/getTeamInfo";

const Team = () => {
  const { abbrev } = useParams();

  const { data, loading, error } = useQuery<getTeamInfo>(GET_TEAM_INFO, {
    variables: {
      abbrev,
    },
  });

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  console.log("data", data);

  if (!data || !data.getTeamInfo) {
    return <PageNoDataFound />;
  }

  const { teamGameGroups, teamGames, teamInfo } = data.getTeamInfo;

  console.log("data.getTeamInfo", data.getTeamInfo);

  return (
    <Container size={"lg"}>
      <Flex alignItems={"center"}>
        <Image
          maxW="48"
          src={`https://cdn.nba.com/logos/nba/${teamInfo.id}/primary/L/logo.svg`}
        />{" "}
        <Box fontWeight={"bold"} fontSize="3xl" ml="2">
          {teamInfo.homeName} {teamInfo.nickname}
        </Box>
      </Flex>
      <Box>
        <Box as="span" fontWeight={"bold"}>
          {" "}
          Games
        </Box>
        {teamGames.map((teamGame, i) => {
          return <Box key={i}>{JSON.stringify(teamGame)}</Box>;
        })}
      </Box>
      <Box>
        <Box as="span" fontWeight={"bold"}>
          {" "}
          Game Groups
        </Box>
        {teamGameGroups.map((teamGameGroup, i) => {
          return <Box key={i}>{JSON.stringify(teamGameGroup)}</Box>;
        })}
      </Box>
    </Container>
  );
};

export default Team;
