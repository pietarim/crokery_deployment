
import { Text, Box, Image } from "@chakra-ui/react";
import { useContext } from "react";
import { RecipeToggleContext } from "../../context/CreateRecipeToggleContext";
import TitleBox from './TitleBox';
import FormSectionButton from "./FormSectionButton";

interface CreateRecipeImageProps {
  previewImage: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateRecipeImage = ({ previewImage, handleImageChange }: CreateRecipeImageProps) => {
  const { imageVisible, toggleVisible } = useContext(RecipeToggleContext);

  return (
    <>
      {imageVisible ? (
        <div style={{ borderBottom: "1px black solid" }}><TitleBox title='Recipe image 2/3' /><Text fontSize='xs' style={{ marginTop: '18px', /* marginBottom: '2px',  */width: '100%', textAlign: 'left' }}>

          Upload image (use .png, .jpg, .jpeg or .webp)
        </Text>
          <input
            style={{ marginBottom: '18px', width: '100%', textAlign: 'left' }}
            type='file' accept='image/png, image/jpeg, image/webp' onChange={handleImageChange}
          />
          {previewImage ? <Box boxSize='sm' overflow='hidden'><Image src={previewImage} alt='recipe' /></Box> : null}
        </div>)
        : (
          <FormSectionButton title='Recipe image' toggleVisible={toggleVisible} toggleSelection='imageVisible' />
        )}
    </>
  );
};

export default CreateRecipeImage;