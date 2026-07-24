import api from './api';
import { setToken, setUserData, removeToken, removeUserData } from '../utils/localStorage';

export const loginUser = async (credentials) => {
  // Hardcoded credentials for testing (remove when real auth is ready)
  let role = 'user';
  let name = 'Test User';

  if (credentials.email === 'superadmin@test.com' && credentials.password === 'superadmin123') {
    role = 'superadmin';
    name = 'Super Admin';
  } else if (credentials.email === 'admin@test.com' && credentials.password === 'admin123') {
    role = 'admin';
    name = 'Admin User';
  }

  const dummyUser = {
    id: 1,
    name,
    email: credentials.email,
    role,
    token: 'dummy-jwt-token-123'
  };
  
  setToken(dummyUser.token);
  setUserData(dummyUser);
  
  return dummyUser;
};

export const logoutUser = () => {
  removeToken();
  removeUserData();
};