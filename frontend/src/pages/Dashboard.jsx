import { useEffect, useState } from 'react';
import {
    GraduationCap, BookMarked, CalendarClock, BookOpen,
    UserCog, Users, LayoutGrid, Building2
} from 'lucide-react';
import { apiFetch, tieneAccesoRuta } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

/* Cada tarjeta se muestra solo si el rol tiene permiso 'ver' sobre esa ruta */
const TARJETAS = [
    { ruta: 'estudiante', endpoint: '/estudiante', label: 'Estudiantes', icon: GraduationCap },
    { ruta: 'matricula', endpoint: '/matricula', label: 'Matrículas', icon: BookMarked },
    { ruta: 'clase', endpoint: '/clase', label: 'Clases', icon: CalendarClock },
    { ruta: 'curso', endpoint: '/curso', label: 'Cursos', icon: BookOpen },
    { ruta: 'profesor', endpoint: '/profesor', label: 'Profesores', icon: UserCog },
    { ruta: 'empleado', endpoint: '/empleado', label: 'Empleados', icon: Users },
    { ruta: 'seccion', endpoint: '/seccion', label: 'Secciones', icon: LayoutGrid },
    { ruta: 'aula', endpoint: '/aula', label: 'Aulas', icon: Building2 },
];

function contarActivos(lista) {
    return lista.filter(r => (r.estado || '').toLowerCase() === 'activo').length;
}

export default function Dashboard() {
    const { sesion } = useAuth();
    const nombre = sesion?.user?.usuario || sesion?.user?.cusuario || 'usuario';

    const tarjetasVisibles = TARJETAS.filter(t => tieneAccesoRuta(sesion, t.ruta));

    const [datos, setDatos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [msg, setMsg] = useState(null);

    async function cargar() {
        setCargando(true);
        setMsg(null);
        try {
            const resultados = await Promise.all(
                tarjetasVisibles.map(t => apiFetch(t.endpoint).catch(() => []))
            );
            const nuevo = {};
            tarjetasVisibles.forEach((t, i) => { nuevo[t.ruta] = resultados[i] || []; });
            setDatos(nuevo);
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        } finally {
            setCargando(false);
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { cargar(); }, []);

    const matriculas = datos.matricula || [];
    const pagadas = matriculas.filter(m => m.estado_mat === 'Pagada').length;
    const pendientes = matriculas.filter(m => m.estado_mat === 'Pendiente').length;
    const recaudado = matriculas
        .filter(m => m.estado_mat === 'Pagada')
        .reduce((total, m) => total + Number(m.costo_mat || 0), 0);

    return (
        <div className="page-inner">
            <div className="page-header-inner">
                <h1>Bienvenido, {nombre}</h1>
            </div>

            {msg && <div className={`msg ${msg.tipo}`}>{msg.texto}</div>}

            <div className="dashboard-grid">
                {tarjetasVisibles.map(t => {
                    const lista = datos[t.ruta] || [];
                    const Icon = t.icon;
                    return (
                        <div key={t.ruta} className="card dashboard-tarjeta">
                            <div className="dashboard-tarjeta-icono"><Icon size={22} /></div>
                            <div className="dashboard-tarjeta-info">
                                <span className="dashboard-tarjeta-numero">{cargando ? '…' : lista.length}</span>
                                <span className="dashboard-tarjeta-label">{t.label}</span>
                                {!cargando && (
                                    <span className="dashboard-tarjeta-sub">{contarActivos(lista)} activos</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {tarjetasVisibles.length === 0 && (
                <div className="empty">No hay estadísticas disponibles para tu rol.</div>
            )}

            {tieneAccesoRuta(sesion, 'matricula') && !cargando && (
                <div className="card panel dashboard-detalle">
                    <h2>Resumen de matrícula</h2>
                    <div className="dashboard-detalle-fila">
                        <span><strong>{pagadas}</strong> pagadas</span>
                        <span><strong>{pendientes}</strong> pendientes</span>
                        <span><strong>L. {recaudado.toFixed(2)}</strong> recaudado</span>
                    </div>
                </div>
            )}
        </div>
    );
}