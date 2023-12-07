import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../utils/common';
import { useNavigate } from 'react-router-dom';

export function useDeny() {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated) {
        navigate('/login');
        return;
      }
      setUser(user);
      setAuthenticated(authenticated);
    }
    getUserDetails();
  }, []);

  return { user, authenticated };
}

export default useDeny;