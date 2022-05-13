import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import PageError from "../components/PageError";
import PageLoader from "../components/PageLoader";
import { GET_ONE_TEAM } from "../graphql/constants";

const Team = () => {
  const { abbrev } = useParams();
  const { data, error, loading } = useQuery(GET_ONE_TEAM, {
    variables: {
      abbrev,
    },
  });

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    console.log("error", error);
    return <PageError error={error} />;
  }

  console.log("data", data);

  return <div>Team</div>;
};

export default Team;
