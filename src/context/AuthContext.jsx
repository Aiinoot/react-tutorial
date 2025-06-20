import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const url = "http://localhost:8000";

const login = async (username, password) => {
  const response = await axios.post(`${url}/login/`, { username, password });
  
  const token = response.data.acess_token; // <- cuidado aqui!
  console.log("Token recebido da API:", token);
  
  localStorage.setItem('token', token);
  setUser({ username });
  navigate('/');
};

  const register = async (username, email, password) => {
    try {
      await axios.post(`${url}/register/`, { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error("Erro no registro:", error.response?.data || error.message);
      alert("Erro ao registrar.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({}); // usuário logado genericamente
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
