// part10/frontend/src/components/TextInput.jsx

import React from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
 textInput: {
   borderColor: theme.colors.details,
   borderWidth: 1,
   borderRadius: theme.radius.medium,
   padding: theme.spacing.small,
   marginTop: theme.spacing.medium,
   backgroundColor: theme.colors.backgroundLight
 },
 error: {
   borderColor: theme.colors.error,
 }
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [
    styles.textInput,
    error && styles.error, 
    style,
  ];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
