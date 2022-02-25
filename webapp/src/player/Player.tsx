import { useQuery } from "@apollo/client";
import { Box, Container } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import PageError from "../components/PageError";
import PageLoader from "../components/PageLoader";
import PageWrapper from "../components/PageWrapper";
import { GET_ONE_PLAYER } from "../graphql/constants";
import { getOnePlayer, getOnePlayerVariables } from "../types/getOnePlayer";
import { getPrettyHeight, getPrettyWeight } from "../utility";

const Player = () => {
  const { slug } = useParams();

  if (!slug) {
    return <PageError error="Player slug is missing. Can't get this player" />;
  }

  const { data, error, loading } = useQuery<
    getOnePlayer,
    getOnePlayerVariables
  >(GET_ONE_PLAYER, {
    variables: {
      slug,
    },
  });

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  const entity = data?.getOnePlayer;

  if (!entity) {
    return <PageError error="Player not found" />;
  }

  return (
    <PageWrapper>
      <Container maxW={"container.xl"} pt={8}>
        <Box bg="white" p={2}>
          {entity.givenName} {entity.familyName} - {entity.team.homeName}{" "}
          {entity.team.nickname} {getPrettyHeight(entity.height)}{" "}
          {getPrettyWeight(entity.weight)}
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default Player;
