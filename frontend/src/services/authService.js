import api from './api';
import { setToken, setUserData, removeToken, removeUserData } from '../utils/localStorage';

export const loginUser = async (credentials) => {
  try {
    // 1. Call the real backend login API
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;

    // 2. Temporarily save the token so the next request is authorized
    setToken(token);

    // 3. Fetch the logged-in user's actual profile details
    const profileResponse = await api.get('/users/profile');
    const user = profileResponse.data;

    // 4. Construct the user object for the frontend
    const loggedInUser = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      role: user.role ? user.role.toLowerCase().replace('_', '') : 'user',
      token: token
    };

    // 5. Save everything to local storage
    setUserData(loggedInUser);
    
    return loggedInUser;
  } catch (error) {
    // Clean up if something fails
    removeToken();
    removeUserData();
    throw error;
  }
};

export const logoutUser = () => {
  removeToken();
  removeUserData();
};