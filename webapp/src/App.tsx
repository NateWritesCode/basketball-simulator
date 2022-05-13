import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ONE_PLAYER } from "./graphql";

const App = () => {
  const { data, error, loading } = useQuery(GET_ONE_PLAYER, {
    variables: {
      id: 1,
    },
  });

  console.log("data", data);
  console.log("error", error);
  console.log("loading", loading);
  return <div>App</div>;
};

export default App;
