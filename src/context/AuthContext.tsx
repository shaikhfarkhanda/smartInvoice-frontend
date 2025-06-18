import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (val: boolean) => void;
    checkAuthStatus: () => Promise<boolean>;
}

// ✅ Initial context with default fallbacks
const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    checkAuthStatus: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            const res = await axios.get("auth/status/");
            setIsLoggedIn(res.data.logged_in);
            return res.data.logged_in;
        } catch {
            setIsLoggedIn(false);
            return false;
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
