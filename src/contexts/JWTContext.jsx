import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// const verifyToken = (serviceToken) => {
//   if (!serviceToken) {
//     return false;
//   }
//   const decoded = jwtDecode(serviceToken);
//   /**
//    * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
//    */
//   return decoded.exp > Date.now() / 1000;
// };
const verifyToken = (serviceToken) => {
  if (!serviceToken) return false;

  const decoded = jwtDecode(serviceToken);
  if (decoded && decoded.exp) {
    return decoded.exp > Date.now() / 1000;
  }

  return false;
};

// const setSession = (serviceToken) => {
//   if (serviceToken) {
//     localStorage.setItem('serviceToken', serviceToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
//   } else {
//     localStorage.removeItem('serviceToken');
//     delete axios.defaults.headers.common.Authorization;
//   }
// };
const setSession = (serviceToken) => {
  if (serviceToken) {
    console.log('Token set in session:', serviceToken); // Debugging line
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          // const response = await axios.get('/api/account/me');
          // const { user } = response.data;
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true
              //user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  // const login = async (email, password) => {
  //   const response = await axios.post('/api/account/login', { email, password });
  //   const { serviceToken, user } = response.data;
  //   setSession(serviceToken);
  //   dispatch({
  //     type: LOGIN,
  //     payload: {
  //       isLoggedIn: true,
  //       user
  //     }
  //   });
  // };

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://gari.remoteintegrity.com/api/auth/login', {
        user_email: email,
        user_password: password
      });

      // Handle response, check if the token and user exist
      if (response.data && response.data.serviceToken) {
        const { serviceToken, user } = response.data;
        setSession(serviceToken); // Store token and set session
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user
          }
        });
      } else {
        throw new Error('Service token not received.');
      }
    } catch (err) {
      console.error('Login failed:', err.message);
      throw new Error('Login failed, please check your credentials.');
    }
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email) => {
    console.log('email - ', email);
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
