import axios from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      return;
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

// export const fetcher = async (args) => {
//   const [url, config] = Array.isArray(args) ? args : [args];

//   const res = await axiosServices.get(url, { ...config });

//   return res.data;
// };

const fetcher = async (url) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from local storage

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}` // Send token in headers
    }
  });

  return response.data;
};

export { fetcher };

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
