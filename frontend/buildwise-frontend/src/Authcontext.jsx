import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase"; // Adjust the import based on your file structure

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
