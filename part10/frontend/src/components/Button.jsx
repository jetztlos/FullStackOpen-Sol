// part10/frontend/src/components/Button.jsx

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.small,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
});

const Button = ({ title, style, ...props }) => {
  const buttonStyle = ({ pressed }) => [
    { opacity: pressed ? 0.7 : 1 },
    styles.button,
    style,
  ];

  return (
    <Pressable style={buttonStyle} {...props}>
      <Text color="textLight" fontWeight="bold">
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;
