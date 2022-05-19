import React from "react";
import { ApolloError } from "@apollo/client";
import PageWrapper from "./PageWrapper";
import { Box, Container } from "@chakra-ui/react";

const PageError = ({ error }: { error: ApolloError | string | undefined }) => {
  return (
    <Container maxW={"container.xl"} pt={8}>
      <Box bg="white" p={2}>
        {JSON.stringify(error)}
      </Box>
    </Container>
  );
};
export default PageError;
