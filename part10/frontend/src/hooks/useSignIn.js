// part10/frontend/src/hooks/useSignIn.js

import { useMutation, useApolloClient } from '@apollo/client';
import useAuthStorage from './useAuthStorage';
import { AUTHORIZE } from '../graphql/mutations';

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const client = useApolloClient();

  const [mutate, result] = useMutation(AUTHORIZE, {
    onCompleted: async (data) => {
      await authStorage.setAccessToken(data.authorize.accessToken);
      await client.resetStore();
    }
  });
  
  const signIn = async ({ username, password }) => {
    const mutationResult = await mutate({
      variables: { username, password },
    });

    return mutationResult;
  };

  return [signIn, result];
};

export default useSignIn;
