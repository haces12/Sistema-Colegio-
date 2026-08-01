import { createContext, useContext, useState } from 'react';
import { getSesion, guardarSesion, limpiarSesion, llamarLogout } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(getSesion());

    function login(token, user) {
        guardarSesion(token, user);
        setSesion({ token, user });
    }

    async function logout() {
        await llamarLogout();
        limpiarSesion();
        setSesion(null);
    }

    return (
        <AuthContext.Provider value={{ sesion, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
