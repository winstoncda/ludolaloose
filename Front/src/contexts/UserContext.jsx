import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Données temporaires d'inscription (avant validation par mail)
  const [tempUser, setTempUser] = useState({});

  // Utilisateur connecté (données complètes du profil)
  const [user, setUser] = useState(null);

  // Déconnexion : reset du state + suppression du token
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ tempUser, setTempUser, user, setUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
