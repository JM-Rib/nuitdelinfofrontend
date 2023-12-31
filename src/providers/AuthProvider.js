import React, { createContext, useState, useContext } from 'react';
import { storeToken, removeToken, getToken } from '../utils/token';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import adminApi from '../api/admin'; 

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const loginAdminApi = useApi(adminApi.loginAdmin);
  const verifyAdminApi = useApi(adminApi.verifyAdmin);

  const login = async (user, password) => {
    const data = {
      identifiantAdmin: user,
      mdpAdmin: password,
    };
  
    const result = await loginAdminApi.request(data);
    if(result?.data){
      storeToken(result?.data.token);
      setAuthenticated(true);
      navigate('/');
    }
  };

  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    removeToken();
    navigate('/');
  };

  async function verifyCurrentToken() {
   await verifyAdminApi.request(getToken());
   console.log(verifyAdminApi.data);
   if (!authenticated) {
     navigate('/login/');
     return;
   }
   setUser(user);
   setAuthenticated(authenticated);
  }

  const denyVisitor = () => {
    if(getToken()){ //si un token existe on re-vérifie sa validité
      verifyCurrentToken();
    }else{ // sinon on renvoie l'utilisateur au login
      navigate('/login/');
    }
  };

  const denyConnectedUser = () => {
    if(getToken()){ //si un token existe on empêche l'accès
      navigate('/');
    }
  };

  const hasLoginData = () => {
    return (getToken());
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        denyVisitor,
        denyConnectedUser,
        hasLoginData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};