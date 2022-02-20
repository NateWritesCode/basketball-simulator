import { useMutation } from "@apollo/client";
import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { START_GAME_SIM } from "./graphql/constants";
import socket from "./Socket";

const GameSim = () => {
  const [startGameSim, { error }] = useMutation(START_GAME_SIM);
  const [gameEvents, setGameEvents] = useState([]);

  console.log(gameEvents);

  useEffect(() => {
    socket.init(setGameEvents);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Box mx={8} my={8}>
      <Button colorScheme={"blue"} onClick={() => startGameSim()}>
        Start game
      </Button>
    </Box>
  );
};

export default GameSim;
