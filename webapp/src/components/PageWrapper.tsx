import { Box } from "@chakra-ui/react";
import React from "react";

const PageWrapper: React.FC = ({ children }) => {
  return <Box minH={"100vh"}>{children}</Box>;
};

export default PageWrapper;
