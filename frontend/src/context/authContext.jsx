import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  
  const login = async (inputs) => {
    try {
      
      const res = await axios.post("/api/auth/login", inputs, {
        withCredentials: true,
      });

      
      const { user_id } = res.data;
      setCurrentUser(user_id);

      
      localStorage.setItem("user", JSON.stringify(user_id));
      return res;
    } catch (err) {
      
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      throw err;
    }
  };

  
  const logout = async () => {
    try {
      
      await axios.post("/api/auth/logout", {}, { withCredentials: true });

      
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      
      console.error(
        "Logout error:",
        err.response ? err.response.data : err.message
      );
      throw err;
    }
  };

  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
