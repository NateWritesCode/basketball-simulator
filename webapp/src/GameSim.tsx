import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { START_GAME_SIM } from "./graphql/constants";
import socket from "./Socket";
import { startGameSim } from "./types/startGameSim";

const GameSim = () => {
  const [startGameSim, { data, error }] = useMutation<startGameSim>(
    START_GAME_SIM,
    {
      fetchPolicy: "network-only",
    }
  );
  const [gameEvents, setGameEvents] = useState([]);

  useEffect(() => {
    socket.init(setGameEvents);

    return () => {
      socket.close();
    };
  }, []);

  const team0 = {
    players: data?.startGameSim?.team0PlayerStats,
    ...data?.startGameSim?.team0,
    ...data?.startGameSim?.team0Stats,
  };

  const team1 = {
    players: data?.startGameSim?.team1PlayerStats,
    ...data?.startGameSim?.team1,
    ...data?.startGameSim?.team1Stats,
  };

  console.log("team0", team0);

  return (
    <Box mx={8} my={8}>
      <Button colorScheme={"blue"} onClick={() => startGameSim()}>
        Start game
      </Button>

      <Table variant="simple" size={"sm"}>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>{team0.name}</Th>
            <Th>{team1.name}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Th>Pts</Th>
            <Td>{team0.pts}</Td>
            <Td>{team1.pts}</Td>
          </Tr>
          <Tr>
            <Th>Ast</Th>
            <Td>{team0.ast}</Td>
            <Td>{team1.ast}</Td>
          </Tr>
          <Tr>
            <Th>Blk</Th>
            <Td>{team0.blk}</Td>
            <Td>{team1.blk}</Td>
          </Tr>
          <Tr>
            <Th>Blkd</Th>
            <Td>{team0.blkd}</Td>
            <Td>{team1.blkd}</Td>
          </Tr>
          <Tr>
            <Th>Drb</Th>
            <Td>{team0.drb}</Td>
            <Td>{team1.drb}</Td>
          </Tr>
          <Tr>
            <Th>Dunks</Th>
            <Td>{team0.dunks}</Td>
            <Td>{team1.dunks}</Td>
          </Tr>
          <Tr>
            <Th>FGA</Th>
            <Td>{team0.fga}</Td>
            <Td>{team1.fga}</Td>
          </Tr>
          <Tr>
            <Th>FGM</Th>
            <Td>{team0.fgm}</Td>
            <Td>{team1.fgm}</Td>
          </Tr>
          <Tr>
            <Th>FTA</Th>
            <Td>{team0.fta}</Td>
            <Td>{team1.fta}</Td>
          </Tr>
          <Tr>
            <Th>FTM</Th>
            <Td>{team0.ftm}</Td>
            <Td>{team1.ftm}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default GameSim;
