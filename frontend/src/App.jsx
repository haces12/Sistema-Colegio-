import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Estudiante from './pages/Estudiante.jsx';
import Matricula from './pages/Matricula.jsx';
import Clase from './pages/Clase.jsx';
import Empleado from './pages/Empleado.jsx';
import Profesor from './pages/Profesor.jsx';
import Curso from './pages/Curso.jsx';
import Seccion from './pages/Seccion.jsx';
import Aula from './pages/Aula.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { tieneAccesoRuta } from './api.js';


function RutaConAcceso({ ruta, children }) {
    const { sesion } = useAuth();
    if (!tieneAccesoRuta(sesion, ruta)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={
                    <RutaConAcceso ruta="dashboard"><Dashboard /></RutaConAcceso>
                } />
                <Route path="estudiante" element={
                    <RutaConAcceso ruta="estudiante"><Estudiante /></RutaConAcceso>
                } />
                <Route path="matricula" element={
                    <RutaConAcceso ruta="matricula"><Matricula /></RutaConAcceso>
                } />
                <Route path="clase" element={
                    <RutaConAcceso ruta="clase"><Clase /></RutaConAcceso>
                } />
                <Route path="empleado" element={
                    <RutaConAcceso ruta="empleado"><Empleado /></RutaConAcceso>
                } />
                <Route path="profesor" element={
                    <RutaConAcceso ruta="profesor"><Profesor /></RutaConAcceso>
                } />
                <Route path="curso" element={
                    <RutaConAcceso ruta="curso"><Curso /></RutaConAcceso>
                } />
                <Route path="seccion" element={
                    <RutaConAcceso ruta="seccion"><Seccion /></RutaConAcceso>
                } />
                <Route path="aula" element={
                    <RutaConAcceso ruta="aula"><Aula /></RutaConAcceso>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}