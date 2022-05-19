import { useMutation } from "@apollo/client";
import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SANDBOX, SIMULATE, SIMULATE_CLEANUP, SIMULATE_PREP } from "../graphql";

const Simulation = () => {
  const [sandbox] = useMutation(SANDBOX);
  const [simulate] = useMutation(SIMULATE);
  const [simulateCleanup] = useMutation(SIMULATE_CLEANUP);
  const [simulatePrep] = useMutation(SIMULATE_PREP);
  const navigate = useNavigate();

  return (
    <Box mx={8} my={8}>
      <Button colorScheme={"blue"} onClick={() => simulate()} mr="2">
        Simulate
      </Button>
      <Button colorScheme={"orange"} onClick={() => simulateCleanup()} mr="2">
        Simulate Cleanup
      </Button>
      <Button colorScheme={"green"} onClick={() => simulatePrep()} mr="2">
        Simulate Prep
      </Button>
      <Button
        colorScheme={"purple"}
        onClick={() => navigate("/league-standings")}
        mr="2"
      >
        Standings
      </Button>
      <Button colorScheme={"red"} onClick={() => sandbox()} mr="2">
        Sandbox
      </Button>
    </Box>
  );
};

export default Simulation;
