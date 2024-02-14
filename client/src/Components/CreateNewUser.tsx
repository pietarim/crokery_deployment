import { Field, Form, Formik } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input, Button, Flex, Card, Heading } from '@chakra-ui/react';
import { register } from '../services/user';
import { FormikProps } from '../types';
import { useNotification } from '../hooks/useNotification';

const CreateNewUser = () => {

  const { showNotification } = useNotification();

  function validateUsername(value: string) {
    let error;
    if (!value) {
      error = 'Username is required';
    }
    return error;
  }

  function validatePassword(value: string) {
    let error;
    if (!value) {
      error = 'Password is required';
    }
    return error;
  }

  function validateEmail(value: string) {
    let error;
    if (!value) {
      error = 'Email is required';
    }
    return error;
  }

  interface NewUser {
    username: string;
    email: string;
    password: string;
  }

  const handleCreateNewUserSubmit = async (newUser: NewUser) => {
    await register(newUser);
  };

  return (
    <Flex justify='center'>
      <Card variant='filled' p='3' width={{ md: '600px' }}>
        <Heading mb={8} mt={6}>Register</Heading>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          onSubmit={(values, actions) => {
            const newUser = {
              username: values.username,
              email: values.email,
              password: values.password,
            };
            try {
              handleCreateNewUserSubmit(newUser);
              actions.setSubmitting(false);
              showNotification('User created', 'success');
            } catch (error) {
              actions.setSubmitting(false);
              showNotification('Error creating user', 'error');
            }
          }}
        >
          {(props) => (
            <Form>
              <Field name='username' validate={validateUsername}>
                {({ field, form }: FormikProps) => (
                  <FormControl isInvalid={!!form.errors.username && form.touched.username}>
                    <FormLabel>Username</FormLabel>
                    <Input style={{ backgroundColor: "white" }} {...field} placeholder='username' />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='email' validate={validateEmail}>
                {({ field, form }: FormikProps) => (
                  <FormControl isInvalid={!!form.errors.email && form.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input style={{ backgroundColor: "white" }} {...field} placeholder='email' />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='password' validate={validatePassword}>
                {({ field, form }: FormikProps) => (
                  <FormControl isInvalid={!!form.errors.password && form.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input style={{ backgroundColor: "white" }} {...field} placeholder='password' type='password' />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Input type='hidden' name='Retype password' value='' placeholder='retype password' />
              <Button
                mt={8}
                mb={7}
                colorScheme='customYellow'
                isLoading={props.isSubmitting}
                type='submit'
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik></Card></Flex>
  );
};

export default CreateNewUser;