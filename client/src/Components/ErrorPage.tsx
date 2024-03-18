import { useRouteError } from "react-router-dom";
import { Box, Heading, Text } from "@chakra-ui/react";

interface RouterError {
  message: string;
}

const ErrorPage = () => {
  const error = useRouteError() as RouterError;
  console.error(error);

  return (
    <Box>
      <Heading as="h1" size="2xl" textAlign="center" mt="20">Error</Heading>
      <Text textAlign="center" mt="10">{error.message}</Text>
    </Box>

  );
};

export default ErrorPage;