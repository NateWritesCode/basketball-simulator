import React from "react";
import { Flex, Box, Spinner } from "@chakra-ui/react";

const PageLoader = () => {
  return (
    <Flex
      minH="100vh"
      minWidth="100vw"
      alignItems="center"
      justifyContent="center"
    >
      <Box textAlign="center">
        <Box fontSize="5xl" mt="1rem">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default PageLoader;
