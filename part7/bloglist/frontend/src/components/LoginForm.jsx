// part7/bloglist/frontend/src/components/LoginForm.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../reducers/loginReducer';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginForm = () => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Set up navigation after login

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      // Dispatch login action and reset the form
      await dispatch(setCurrentUser(loginCredentials));
      setLoginCredentials({ username: '', password: '' });

      // Navigate to another page after login (e.g., /blogs)
      navigate('/blogs');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCredentialsChange = (event) => {
    const { name, value } = event.target;
    setLoginCredentials((loginCredentials) => ({
      ...loginCredentials,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <div>
        <TextField
          id="username"
          label="Username"
          type="text"
          value={loginCredentials.username}
          name="username"
          margin="normal"
          onChange={handleCredentialsChange}
        />
      </div>
      <div>
        <TextField
          id="password"
          label="Password"
          type="password"
          value={loginCredentials.password}
          name="password"
          margin="normal"
          onChange={handleCredentialsChange}
        />
      </div>
      <Button
        id="login-button"
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
