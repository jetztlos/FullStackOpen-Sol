// part7/bloglist/frontend/src/services/login.js

import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/login'; // Direct URL

const login = async (credentials) => {
  try {
    console.log('Sending POST request to /api/login with:', credentials);  // Debugging URL
    const response = await axios.post(baseUrl, credentials); 
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response || error.message);
    throw error;
  }
};

export default { login };
