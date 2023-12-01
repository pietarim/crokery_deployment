import { Field, Form, Formik } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input, Button } from '@chakra-ui/react';
/* import { SetUserProp } from '../types'; */
import { login } from '../services/user';
import { useAuth } from '../hooks/useAuth';

/* interface User {
  username: string;
  token: string;
}

type UserState = User | null;

interface setUserProp {
  setUser: (user: UserState) => void;
}
 */
function LoginForm(/* { setUser }: SetUserProp */) {
  const { setToken } = useAuth();
  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }

  function validatePassword(value) {
    let error;
    if (!value) {
      error = 'Password is required';
    }
    return error;
  }

  const handleLoginSubmit = async (loginData) => {
    console.log('loginData', loginData);
    const newLogin = {
      username: loginData.name,
      password: loginData.password,
    };
    console.log('newLogin', newLogin);
    const savedLogin = await login(newLogin);
    /* setUser(savedLogin); */
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
        /* setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000); */
      }}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>First name</FormLabel>
                <Input {...field} placeholder='name' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name='password' validate={validatePassword}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.password && form.touched.password}>
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