import { Box } from "@chakra-ui/react";

interface TitleBoxProps {
  title: string;
}

const TitleBox = ({ title }: TitleBoxProps) => {
  return (
    <Box bg='anotherCustomYellow.500' color="white" style={{ fontWeight: "bold", height: "44px", alignContent: "center" }}>
      {title}
    </Box>
  );
};

export default TitleBox;