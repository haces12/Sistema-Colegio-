

export const API_BASE = 'http://localhost:3000';


export const ROL_ADMIN = 1;
export const ROL_PROF_GUIA = 2;


const PERMISOS_PROF_GUIA = {
    dashboard:  ['ver'],                        
    estudiante: ['ver', 'crear', 'modificar'],
    matricula:  ['ver'],                       
    clase:      ['ver', 'crear'],               
    profesor:   ['ver'],                        
};

function permisosDe(sesion, recurso) {
    if (esAdmin(sesion)) return ['ver', 'crear', 'modificar', 'eliminar'];
    if (esProfGuia(sesion)) return PERMISOS_PROF_GUIA[recurso] || [];
    return [];
}

export function getRol(sesion) {
    return Number(sesion?.user?.ctipousuario) || null;
}

export function esAdmin(sesion) {
    return getRol(sesion) === ROL_ADMIN;
}

export function esProfGuia(sesion) {
    return getRol(sesion) === ROL_PROF_GUIA;
}


export function tieneAccesoRuta(sesion, ruta) {
    return permisosDe(sesion, ruta).includes('ver');
}

export function puedeCrear(sesion, recurso) {
    return permisosDe(sesion, recurso).includes('crear');
}


export function puedeModificar(sesion, recurso) {
    return permisosDe(sesion, recurso).includes('modificar');
}


export function puedeEliminar(sesion, recurso) {
    if (recurso) return permisosDe(sesion, recurso).includes('eliminar');
    return !esProfGuia(sesion);
}


export function normalizarTexto(txt) {
    return String(txt ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function getSesion() {
    const raw = localStorage.getItem('sesion');
    return raw ? JSON.parse(raw) : null;
}

export function guardarSesion(token, user) {
    localStorage.setItem('sesion', JSON.stringify({ token, user }));
}

export function limpiarSesion() {
    localStorage.removeItem('sesion');
}

export async function llamarLogout() {
    const sesion = getSesion();
    if (!sesion || !sesion.user) return;
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cusuario: sesion.user.cusuario })
        });
    } catch (_) { }
}


export async function apiFetch(path, options = {}) {
    const sesion = getSesion();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(sesion ? { Authorization: `Bearer ${sesion.token}` } : {})
    };
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
        let msg = `Error ${res.status}`;
        try { msg = (await res.text()) || msg; } catch (_) {}
        throw new Error(msg);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}