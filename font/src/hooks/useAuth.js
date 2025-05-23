import { useState, useEffect } from 'react';
import api from '../api';
import { getUserType } from '../utils/user';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login with email and password
  const login = async (email, password) => {
    try {
      const response = await api.post('users/token/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      await fetchUser();  // fetch full user profile with user_type
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup new user, handle auto-login or manual login after
  const signup = async (userData) => {
    try {
      const signupResponse = await api.post('/users/register/', {
        username: userData.username,
        email: userData.email || userData.username,
        password: userData.password,
        name: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`.trim()
          : userData.name,
        first_name: userData.firstName,
        last_name: userData.lastName,
        address: userData.address,
        city: userData.city,
        // Add other fields your backend expects
      });

      if (signupResponse.data.access && signupResponse.data.refresh) {
        const { access, refresh } = signupResponse.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

        if (signupResponse.data.user) {
          setUser(signupResponse.data.user);
        } else {
          await fetchUser();
        }
      } else {
        // fallback to manual login if tokens not returned
        await login(userData.email || userData.username, userData.password);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout clears tokens and user state
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user state locally
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Fetch user profile info (including user_type)
  const fetchUser = async () => {
    try {
      const response = await api.get('/users/profile/'); // adjust endpoint as needed
      setUser(response.data);
    } catch (error) {
      console.error('User fetch failed:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // On mount, check local token and fetch user profile if exists
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      
      if (accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await fetchUser();
      } else {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return {
    user,
    login,
    signup,
    logout,
    updateUser,
    authLoading,
    isAuthenticated: !!user,
    getUserType, // utility function, can be used outside hook
  };
};

export default useAuth;