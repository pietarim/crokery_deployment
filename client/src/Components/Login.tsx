import { Field, Form, Formik } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input, Button } from '@chakra-ui/react';
import { login } from '../services/user';
import { useAuth } from '../hooks/useAuth';

interface FieldProps {
  field: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  };
  form: {
    touched: { [field: string]: boolean; };
    errors: { [field: string]: string; };
  };
}

function LoginForm() {
  const { setToken } = useAuth();
  function validateName(value: string) {
    let error;
    if (!value) {
      error = 'Name is required';
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

  interface LoginData {
    name: string;
    password: string;
  }

  const handleLoginSubmit = async (loginData: LoginData) => {
    const newLogin = {
      username: loginData.name,
      password: loginData.password,
    };
    const savedLogin = await login(newLogin);
    setToken({ token: savedLogin.token, username: savedLogin.username, id: savedLogin.id });
  };

  return (
    <Formik
      initialValues={{ name: '', password: '' }}
      onSubmit={(values, actions) => {
        const loginData = {
          name: values.name,
          password: values.password,
        };
        handleLoginSubmit(loginData);
        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }: FieldProps) => (
              <FormControl isInvalid={!!form.errors.name && form.touched.name}>
                <FormLabel>First name</FormLabel>
                <Input {...field} placeholder='name' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name='password' validate={validatePassword}>
            {({ field, form }: FieldProps) => (
              <FormControl isInvalid={!!form.errors.password && form.touched.password}>
                <FormLabel>Password</FormLabel>
                <Input {...field} placeholder='password' type='password' />
                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme='teal'
            isLoading={props.isSubmitting}
            type='submit'
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;