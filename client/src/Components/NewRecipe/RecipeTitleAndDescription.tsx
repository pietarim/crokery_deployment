import { Field } from 'formik';
import { FormikProps, FormikPropsWithTextarea } from "../../types";
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useContext } from 'react';
import { RecipeToggleContext } from "../../context/CreateRecipeToggleContext";
import TitleBox from './TitleBox';
import FormSectionButton from './FormSectionButton';

interface RecipeTitleAndDescriptionProps {
  validateName: (value: string) => string | undefined;
  validateDescription: (value: string) => string | undefined;
}

const RecipeTitleAndDescription = ({ validateName, validateDescription }: RecipeTitleAndDescriptionProps) => {

  const { titleVisible, toggleVisible } = useContext(RecipeToggleContext);

  return (
    <>
      {titleVisible ? (
        <div style={{ borderBottom: "black 1px solid" }}>
          <TitleBox title='Recipe title 1/3' />
          <Field name='name' validate={validateName}>
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
          </Field>
          <label>
            <Field style={{ margin: "18px" }} type='checkbox' name='public' />
            Make public
          </label>
        </div>) :
        (
          <FormSectionButton title='Recipe description' toggleVisible={toggleVisible} toggleSelection='titleVisible' />
        )}
    </>
  );
};

export default RecipeTitleAndDescription;