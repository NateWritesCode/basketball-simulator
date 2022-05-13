import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Image,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoxScorePlayersTable from "./components/BoxScorePlayersTable";
import { RESET_DATA, START_GAME_SIM } from "./graphql/constants";
import socket from "./Socket";
import { resetData } from "./types/resetData";
import { startGameSim } from "./types/startGameSim";

const GameSim = () => {
  const navigate = useNavigate();
  const [startGameSim, { data, error }] = useMutation<startGameSim>(
    START_GAME_SIM,
    {
      fetchPolicy: "network-only",
    }
  );
  const [resetData] = useMutation<resetData>(RESET_DATA, {
    fetchPolicy: "network-only",
  });
  const [gameEvents, setGameEvents] = useState([]);

  useEffect(() => {
    socket.init(setGameEvents);

    return () => {
      socket.close();
    };
  }, []);

  const team0 = data?.startGameSim?.teams[0];
  const team0Stats = data?.startGameSim?.teamStats[0];
  const team0PlayerStats = data?.startGameSim?.playerStats[0];
  const team1 = data?.startGameSim?.teams[1];
  const team1Stats = data?.startGameSim?.teamStats[1];
  const team1PlayerStats = data?.startGameSim?.playerStats[1];

  return (
    <Box mx={8} my={8}>
      <Button colorScheme={"blue"} onClick={() => startGameSim()}>
        Run game sim
      </Button>
      <Button colorScheme={"red"} onClick={() => resetData()} mx="4">
        Reset Data
      </Button>
      <Button colorScheme={"purple"} onClick={() => navigate("/standings")}>
        Standings
      </Button>
      {team0 && team1 && (
        <>
          <Flex my={2} fontWeight="bold" fontSize={"2xl"} alignItems="center">
            <Image
              maxW={20}
              src={`https://cdn.nba.com/logos/nba/${team0.id}/primary/L/logo.svg`}
            />
            {team0.homeName} {team0.nickname} - {team0Stats?.pts}
          </Flex>
          <BoxScorePlayersTable data={team0PlayerStats} />
          <Flex my={2} fontWeight="bold" fontSize={"2xl"} alignItems="center">
            <Image
              maxW={20}
              src={`https://cdn.nba.com/logos/nba/${team1.id}/primary/L/logo.svg`}
            />
            {team1.homeName} {team1.nickname} {team1Stats?.pts}
          </Flex>
          <BoxScorePlayersTable data={team1PlayerStats} />
        </>
      )}
    </Box>
  );
};

export default GameSim;
