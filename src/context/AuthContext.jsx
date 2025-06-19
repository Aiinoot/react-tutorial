import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const url = "http://localhost:8000";

  const login = async (email, password) => {
    const response = await axios.post(`${url}/login`, {
      userName: email,
      password
    });
    localStorage.setItem('token', response.data.token);
    setUser({ email });
    navigate('/');
  };

  const register = async (nome, email, password) => {
    await axios.post(`${url}/register`, {
      userName: nome, 
      email,
      password
    });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({});
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
