
import { Text, Box, Image } from "@chakra-ui/react";
import { Field } from 'formik';
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { RecipeToggleContext } from "../context/CreateRecipeToggleContext";

interface CreateRecipeImageProps {
  previewImage: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateRecipeImage = ({ previewImage, handleImageChange }: CreateRecipeImageProps) => {
  const { imageVisible, toggleVisible } = useContext(RecipeToggleContext);

  return (
    <>
      {imageVisible ? (<><Text fontSize='xs' style={{ marginTop: '18px', marginBottom: '2px', width: '100%', textAlign: 'left' }}>
        Upload image (use .png, .jpg, .jpeg or .webp)
      </Text>
        <input
          style={{ marginBottom: '18px', width: '100%', textAlign: 'left' }}
          type='file' accept='image/png, image/jpeg, image/webp' onChange={handleImageChange}
        />
        <label>
          <Field type='checkbox' name='public' />
          Make public
        </label>
        {previewImage ? <Box boxSize='sm' overflow='hidden'><Image src={previewImage} alt='recipe' /></Box> : null}</>)
        : (<ArrowUpDownIcon onClick={() => toggleVisible('imageVisible')} />)}
    </>
  );
};

export default CreateRecipeImage;