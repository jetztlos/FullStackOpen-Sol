// part10/frontend/src/utils/authStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
    this.tokenKey = `${this.namespace}:token`;
  }

  async getAccessToken() {
    return await AsyncStorage.getItem(this.tokenKey);
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(this.tokenKey, accessToken);
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(this.tokenKey);
  }
}

export default AuthStorage;
