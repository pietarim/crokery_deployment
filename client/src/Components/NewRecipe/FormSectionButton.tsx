import { Text, Box } from "@chakra-ui/react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";

type ToggleSelection = 'titleVisible' | 'imageVisible' | 'itemVisible';

interface FormSectionButtonProps {
  title: string;
  toggleVisible: (visible: string) => void;
  toggleSelection: ToggleSelection;
};

const FormSectionButton = ({ title, toggleVisible, toggleSelection }: FormSectionButtonProps) => {

  return (
    <Box
      className="formAreaButton" onClick={() => toggleVisible(toggleSelection)}
    >
      <ArrowUpDownIcon ml="14px" mb="14px" mt="14px" style={{ backgroundColor: "lightgray", borderRadius: "10px", display: "inline-block" }} />
      <Text ml={"16px"} display={'inline-block'}>{title}</Text>
    </Box>
  );
};

export default FormSectionButton;