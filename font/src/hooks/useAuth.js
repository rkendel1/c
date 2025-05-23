import { useState, useEffect } from 'react';
import api from '../api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await api.post('/token/', {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      await fetchUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      // First create the account
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
        // Add any other fields your backend expects
      });

      // The response should contain tokens if auto-login is enabled
      if (signupResponse.data.access && signupResponse.data.refresh) {
        const { access, refresh } = signupResponse.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        // Set user from signup response
        if (signupResponse.data.user) {
          setUser(signupResponse.data.user);
        } else {
          await fetchUser();
        }
      } else {
        // If no auto-login, manually log them in
        await login(userData.email || userData.username, userData.password);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/profile/'); // Adjust endpoint as needed
      setUser(response.data);
    } catch (error) {
      console.error('User fetch failed:', error);
      // Only logout on auth errors, not network errors
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Initialize auth state on mount
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
  };
};

export default useAuth;