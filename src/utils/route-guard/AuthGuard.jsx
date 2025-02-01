import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigate('login', {
      state: {
        from: location.pathname
      },
      replace: true
    });
  }, [navigate, location]);

  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
