import React from "react";
import { ApolloError } from "@apollo/client";
import PageWrapper from "./PageWrapper";
import { Box, Container } from "@chakra-ui/react";

const PageNoDataFound = () => {
  return (
    <Container maxW={"container.xl"} pt={8}>
      <Box bg="white" p={2}>
        No Data Found
      </Box>
    </Container>
  );
};
export default PageNoDataFound;
