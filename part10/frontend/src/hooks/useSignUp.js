// part10/frontend/src/hooks/useSignUp.js

import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../graphql/mutations';

const useSignUp = () => {
  const [mutate, result] = useMutation(CREATE_USER);

  const signUp = async ({ username, password }) => {
    const mutationResult = await mutate({
      variables: { username, password },
    });

    return mutationResult;
  };

  return [signUp, result];
};

export default useSignUp;
