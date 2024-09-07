import { createContext, useContext, useReducer } from 'react';
import { SERVER_URL } from '../utils/constants';
import toast from 'react-hot-toast';

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
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

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

      console.log({ register: data });

      dispatch({ type: 'register', payload: data });
    } catch (err) {
      toast.error(err.message);
    }
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

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
