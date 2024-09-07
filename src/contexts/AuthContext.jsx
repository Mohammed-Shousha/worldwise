import { createContext, useContext, useEffect, useReducer } from 'react';
import { SERVER_URL } from '../utils/constants';
import toast from 'react-hot-toast';

import {
  saveToLocalStorage,
  getFromLocalStorage,
  clearLocalStorage,
} from '../utils/localStorage';
import { useCities } from './CitiesContext';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'register':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'loading':
      return { ...state, isLoading: true };

    case 'logout':
      return { ...state, user: null, isAuthenticated: false };

    default:
      throw new Error('Unknown action type');
  }
}

function AuthProvider({ children }) {
  const { refreshCities } = useCities();

  async function login(email, password) {
    dispatch({ type: 'loading' });

    try {
      const response = await fetch(`${SERVER_URL}/users?email=${email}`);
      const data = await response.json();

      if (data.length === 0) {
        throw new Error('User not found');
      }

      const user = data[0];

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      saveToLocalStorage('userId', user.id);
      saveToLocalStorage('isAuthenticated', true);

      refreshCities(user.id);

      dispatch({ type: 'login', payload: user });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function register(name, email, password) {
    dispatch({ type: 'loading' });

    try {
      const checkResponse = await fetch(`${SERVER_URL}/users?email=${email}`);

      const checkData = await checkResponse.json();

      if (checkData.length > 0) {
        throw new Error('Email already in use');
      }

      const response = await fetch(`${SERVER_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      saveToLocalStorage('userId', data.id);
      saveToLocalStorage('isAuthenticated', true);

      refreshCities(data.id);

      dispatch({ type: 'register', payload: data });
    } catch (err) {
      toast.error(err.message);
    }
  }

  function logout() {
    clearLocalStorage();

    dispatch({ type: 'logout' });
  }

  const isAuthenticatedFromStorage =
    getFromLocalStorage('isAuthenticated') || false;

  const initialStateWithStorage = {
    ...initialState,
    isAuthenticated: isAuthenticatedFromStorage,
  };

  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialStateWithStorage
  );

  useEffect(() => {
    async function fetchUser() {
      const userId = getFromLocalStorage('userId');

      if (!userId) return;

      const response = await fetch(`${SERVER_URL}/users/${userId}`);
      const data = await response.json();

      console.log({ fetchUser: data });

      dispatch({ type: 'login', payload: data });
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
