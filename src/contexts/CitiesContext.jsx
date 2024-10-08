import { createContext, useReducer, useEffect, useContext } from 'react';

import { SERVER_URL } from '../utils/constants';
import { getFromLocalStorage } from '../utils/localStorage';

const CitiesContext = createContext();

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    intialState
  );

  useEffect(function () {
    async function fetchCities() {
      const userId = getFromLocalStorage('userId');
      dispatch({ type: 'loading' });

      try {
        const res = await fetch(`${SERVER_URL}/cities?userId=${userId}`);
        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({ type: 'rejected', payload: err.message });
      }
    }

    fetchCities();
  }, []);

  async function refreshCities(userId) {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${SERVER_URL}/cities?userId=${userId}`);
      const data = await res.json();

      dispatch({ type: 'cities/loaded', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: err.message });
    }
  }

  async function getCity(id) {
    if (id === currentCity.id) return;

    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${SERVER_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: err.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'loading' });

    const userId = getFromLocalStorage('userId');

    try {
      const res = await fetch(`${SERVER_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify({ ...newCity, userId }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: err.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });

    try {
      await fetch(`${SERVER_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      dispatch({ type: 'rejected', payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
        refreshCities,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error('useCities must be used within a CitiesProvider');
  }

  return context;
}

export { CitiesProvider, useCities };
