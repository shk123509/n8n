"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // Token extraction logic
    const token = data.accesstoken || data.accessToken || data.token || data?.data?.accesstoken;

    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(data.user || data));
      setUser(data.user || data);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);