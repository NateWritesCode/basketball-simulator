import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PageWrapper: React.FC = ({ children }) => {
  const navigate = useNavigate();
  return (
    <Box minH={"100vh"}>
      <Box>
        <Button size={"xs"} onClick={() => navigate("/")}>
          Home
        </Button>
      </Box>

      {children}
    </Box>
  );
};

export default PageWrapper;
