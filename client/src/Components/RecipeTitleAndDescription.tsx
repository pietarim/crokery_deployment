import { Field } from 'formik';
import { FormikProps, FormikPropsWithTextarea } from "../types";
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { ArrowUpDownIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { RecipeToggleContext } from "../context/CreateRecipeToggleContext";

interface RecipeTitleAndDescriptionProps {
  validateName: (value: string) => string | undefined;
  validateDescription: (value: string) => string | undefined;
}

const RecipeTitleAndDescription = ({ validateName, validateDescription }: RecipeTitleAndDescriptionProps) => {

  const { titleVisible, toggleVisible } = useContext(RecipeToggleContext);

  return (
    <>
      {titleVisible ? (<><Field name='name' validate={validateName}>
        {({ field, form }: FormikProps) => (
          <FormControl isInvalid={!!form.errors.name && form.touched.name}>
            <FormLabel>Recipe name</FormLabel>
            <Input style={{ backgroundColor: "white" }} {...field} placeholder='Recipe name' />
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
        <Field name='description' validate={validateDescription}>
          {({ field, form }: FormikPropsWithTextarea) => (
            <FormControl isInvalid={!!form.errors.description && form.touched.description}>
              <FormLabel>Recipe description</FormLabel>
              <Textarea
                {...field}
                placeholder='Description of the recipe...'
                style={{ backgroundColor: "white" }}
                size='sm'
              />
              <FormErrorMessage>{form.errors.description}</FormErrorMessage>
            </FormControl>
          )}
        </Field></>) :
        (
          <>
            <ArrowUpDownIcon onClick={() => toggleVisible('titleVisible')} />
          </>
        )}
    </>
  );
};

export default RecipeTitleAndDescription;