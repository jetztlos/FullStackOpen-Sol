// part10/frontend/src/components/AppBar/index.jsx

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useQuery, useApolloClient } from '@apollo/client';

import AppBarTab from './AppBarTab';
import theme from '../../theme';
import useAuthStorage from '../../hooks/useAuthStorage';
import { GET_AUTHORIZED_USER } from '../../graphql/queries';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    flexDirection: 'row',
  }
});

const AppBar = () => {
  const authStorage = useAuthStorage();
  const client = useApolloClient();

  const { data } = useQuery(GET_AUTHORIZED_USER, {
    fetchPolicy: 'cache-and-network',
  });

  const authorizedUser = data?.authorizedUser;

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await client.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab text="Repositories" url="/" />
        {authorizedUser && <AppBarTab text="Add a Review" url="/add-review" />}
        {authorizedUser && <AppBarTab text="My Reviews" url="/my-reviews" />}
        {authorizedUser && <AppBarTab text="Sign Out" url="/sign-out" onPress={signOut} />}
        {!authorizedUser && <AppBarTab text="Sign In" url="/sign-in" />}
        {!authorizedUser && <AppBarTab text="Sign Up" url="/sign-up" />}
      </ScrollView>
    </View>
  );
};

export default AppBar;
