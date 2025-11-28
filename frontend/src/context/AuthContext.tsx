import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
    username: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
        }
        setLoading(false);
    }, []);

    const login = (token: string, user: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);
        setIsAuthenticated(true);
        setUsername(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
