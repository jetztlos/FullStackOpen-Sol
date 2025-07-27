// part10/frontend/src/components/SignUp/index.jsx

import React from 'react';
import { useHistory } from 'react-router-native';

import useSignUp from '../../hooks/useSignUp';
import useSignIn from '../../hooks/useSignIn';
import SignUpContainer from './SignUpContainer';

const SignUp = () => {
  const [signUp, { error }] = useSignUp();
  const [signIn] = useSignIn();
  const history = useHistory();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signUp({ username, password });
      await signIn({ username, password });
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return <SignUpContainer onSubmit={onSubmit} error={error} />;
};

export default SignUp;
