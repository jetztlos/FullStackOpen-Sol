// part10/frontend/src/components/SignUp/SignUpContainer.jsx

import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { View, StyleSheet } from 'react-native';

import FormikTextInput from '../FormikTextInput';
import Button from '../Button';
import Text from '../Text';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  form: {
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.tiny,
  }
});

const initialValues = {
  username: '',
  password: '',
  passwordConfirmation: '',
};

const validationSchema = Yup.object().shape({
  username: Yup
    .string()
    .min(1, 'Username must be at least 1 character')
    .max(30, 'Username must be 30 characters or less')
    .required('Username is required'),
  password: Yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be 50 characters or less')
    .required('Password is required'),
  passwordConfirmation: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Password confirmation must match password')
    .required('Password confirmation is required'),
});

const SignUpContainer = ({ onSubmit, error }) => {
  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <View style={styles.form}>
            <FormikTextInput
              name="username"
              placeholder="Username"
              autoCapitalize="none"
            />
            <FormikTextInput
              name="password"
              placeholder="Password"
              secureTextEntry
            />
            <FormikTextInput
              name="passwordConfirmation"
              placeholder="Password confirmation"
              secureTextEntry
            />
            <Button
              onPress={handleSubmit}
              title="Sign Up"
              testID="submitButton"
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignUpContainer;
