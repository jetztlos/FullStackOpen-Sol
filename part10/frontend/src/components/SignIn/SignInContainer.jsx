// part10/frontend/src/components/SignIn/SignInContainer.jsx

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
};

const validationSchema = Yup.object().shape({
  username: Yup
    .string()
    .required('Username is required'),
  password: Yup
    .string()
    .required('Password is required'),
});

const SignInContainer = ({ onSubmit, error }) => {
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
              testID="usernameField"
            />
            <FormikTextInput
              name="password"
              placeholder="Password"
              secureTextEntry
              testID="passwordField"
            />
            <Button
              onPress={handleSubmit}
              title="Sign In"
              testID="submitButton"
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignInContainer;
