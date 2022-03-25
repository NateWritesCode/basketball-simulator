import React, { useState } from "react";
import { Box, Button, Select } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client";
import { sqlSandbox, sqlSandboxVariables } from "../types/sqlSandbox";
import { SQL_SANDBOX } from "../graphql/constants";
import ReactJson from "react-json-view";

export default () => {
  const [dbType, setDbType] = useState("custom");
  const [sqlString, setSqlString] = useState("");
  const [values, setValues] = useState("");
  const [sqlSandbox, { loading, error, data }] = useLazyQuery<
    sqlSandbox,
    sqlSandboxVariables
  >(SQL_SANDBOX, {
    fetchPolicy: "network-only",
  });

  if (error) {
    console.error(error);
  }

  return (
    <Box>
      <Box my={"2"}>
        <Select value={dbType} onChange={(e) => setDbType(e.target.value)}>
          <option value="custom">Custom</option>
          <option value="postgres">Postgres</option>
          <option value="presto">Presto</option>
        </Select>
      </Box>
      <Button
        onClick={() =>
          sqlSandbox({
            variables: {
              dbType,
              sqlString,
              values,
            },
          })
        }
      >
        Run query
      </Button>
      <Box mt="2">
        {loading ? (
          <Box>Fetching Results</Box>
        ) : (
          <>
            {data && data.sqlSandbox && (
              <ReactJson src={JSON.parse(data.sqlSandbox)} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
