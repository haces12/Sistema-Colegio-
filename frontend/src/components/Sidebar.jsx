import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, GraduationCap, BookMarked, CalendarClock, Users, UserCog,
    BookOpen, LayoutGrid, Building2, PanelLeftClose, PanelLeftOpen, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { tieneAccesoRuta } from '../api.js';
import logoColegio from '../logo1.png'; 

const ITEMS = [
    { ruta: 'dashboard', to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { ruta: 'estudiante', to: '/estudiante', label: 'Estudiantes', icon: GraduationCap },
    { ruta: 'matricula', to: '/matricula', label: 'Matrícula', icon: BookMarked },
    { ruta: 'clase', to: '/clase', label: 'Clases', icon: CalendarClock },
    { ruta: 'curso', to: '/curso', label: 'Cursos', icon: BookOpen },
    { ruta: 'seccion', to: '/seccion', label: 'Secciones', icon: LayoutGrid },
    { ruta: 'aula', to: '/aula', label: 'Aulas', icon: Building2 },
    { ruta: 'profesor', to: '/profesor', label: 'Profesores', icon: UserCog },
    { ruta: 'empleado', to: '/empleado', label: 'Empleados', icon: Users },
];

export default function Sidebar({ colapsado, onToggle }) {
    const { sesion, logout } = useAuth();
    const nombre = sesion?.user?.usuario || sesion?.user?.cusuario || 'usuario';
    const itemsVisibles = ITEMS.filter(item => tieneAccesoRuta(sesion, item.ruta));

    return (
        <aside className={`sidebar ${colapsado ? 'colapsado' : ''}`}>
            <div className="sidebar-top">
                <button className="sidebar-toggle" onClick={onToggle} title={colapsado ? 'Expandir' : 'Colapsar'}>
                    {colapsado ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
                {!colapsado && (
                    <div className="sidebar-brand-group">
                    <div className="sidebar-logo-container">
                      <img
                       src={logoColegio}
                        alt="Logo del colegio"
                     className="sidebar-logo"
                      />
                    </div>

             <h2 className="sidebar-school-name">
                   Colegio
              <span>Dr. Phillips</span>
            </h2>
            </div>
                )}
            </div>

            <nav className="sidebar-nav">
                {itemsVisibles.map(({ ruta, to, label, icon: Icon }) => (
                    <NavLink key={ruta} to={to}
                             className={({isActive}) => `sidebar-link ${isActive ? 'activo' : ''}`}
                             title={label}>
                        <Icon size={19} />
                        {!colapsado && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
               <div className="sidebar-profile">
                     <i className="bi bi-person-circle"></i>
                    {!colapsado && <span className="sidebar-user">{nombre}</span>}
                </div>
                <button className="sidebar-link salir" onClick={logout} title="Cerrar sesión">
                    <LogOut size={19} />
                    {!colapsado && <span>Cerrar sesión</span>}
                </button>
            </div>
        </aside>
    );
}