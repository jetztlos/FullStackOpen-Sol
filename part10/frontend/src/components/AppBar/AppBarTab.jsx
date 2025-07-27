// part10/frontend/src/components/AppBar/AppBarTab.jsx

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

import Subheading from '../Subheading';
import theme from '../../theme';

const styles = StyleSheet.create({
  tab: {
    padding: theme.spacing.medium,
  },
});

const AppBarTab = ({ text, url, onPress }) => {
  return (
    <Link
      to={url}
      component={Pressable}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, styles.tab]}
      onPress={onPress}
    >
      <Subheading color="textLight">
        {text}
      </Subheading>
    </Link>
  );
};

export default AppBarTab;
