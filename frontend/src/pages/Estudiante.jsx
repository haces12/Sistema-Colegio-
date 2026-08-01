import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeEliminar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const VACIO = {
    pnom_est: '', snom_est: '', pape_est: '', sape_est: '',
    sexo_est: 'M', tel_est: '', cor_est: '', estado: 'Activo'
};

export default function Estudiante() {
    const { sesion } = useAuth();
    const mostrarEliminar = puedeEliminar(sesion);

    const [registros, setRegistros] = useState([]);
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modo, setModo] = useState(null); // 'insertar' | 'modificar' | null
    const [form, setForm] = useState(VACIO);
    const [msg, setMsg] = useState(null); // { texto, tipo }
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');

    async function consultar() {
        setMsg(null);
        setModo(null);
        try {
            const data = await apiFetch('/estudiante');
            setRegistros(data || []);
            setMostrarBuscador(true);
            setBusqueda('');
            setFiltro('');
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        }
    }

    function buscar() {
        setFiltro(busqueda);
    }

    function limpiarBusqueda() {
        setBusqueda('');
        setFiltro('');
    }

    const registrosFiltrados = filtro.trim() === ''
        ? registros
        : registros.filter(r => normalizarTexto(`${r.pnom_est} ${r.snom_est} ${r.pape_est} ${r.sape_est}`).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    function abrirIngresar() {
        setMsg(null);
        setSeleccionadoId(null);
        setForm(VACIO);
        setModo('insertar');
    }

    function abrirModificar() {
        setMsg(null);
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un estudiante de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.id_est) === String(seleccionadoId));
        if (!r) return;
        setForm({
            pnom_est: r.pnom_est || '', snom_est: r.snom_est || '',
            pape_est: r.pape_est || '', sape_est: r.sape_est || '',
            sexo_est: r.sexo_est || 'M', tel_est: r.tel_est || '',
            cor_est: r.cor_est || '', estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un estudiante de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja al estudiante #${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/estudiante/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'El estudiante fue dado de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            setSeleccionadoId(null);
            await consultar();
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
            CoolAlert.show({ icon: 'error', title: 'Error', text: err.message, confirmButtonText: 'Aceptar', showCancelButton: false });
        }
    }

    async function guardar(e) {
        e.preventDefault();
        setMsg(null);
        try {
            if (modo === 'insertar') {
                await apiFetch('/estudiante', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Estudiante ingresado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'El estudiante fue ingresado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar') {
                await apiFetch(`/estudiante/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Estudiante actualizado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'El estudiante fue actualizado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            }
            setModo(null);
            await consultar();
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
            CoolAlert.show({ icon: 'error', title: 'Error', text: err.message, confirmButtonText: 'Aceptar', showCancelButton: false });
        }
    }

    function campo(nombre) {
        return {
            value: form[nombre],
            onChange: e => setForm(f => ({ ...f, [nombre]: e.target.value }))
        };
    }

    return (
        <div className="page-inner">
            <div className="page-header-inner">
                <h1>Estudiantes</h1>
            </div>

            <div className="card panel">
                {msg && <div className={`msg ${msg.tipo}`}>{msg.texto}</div>}

                <div className="toolbar">
       
                    <button className="btn" onClick={abrirIngresar}>Ingresar</button>
                    <button className="btn" onClick={abrirModificar}>Modificar</button>
                    {mostrarEliminar && <button className="btn danger" onClick={eliminar}>Eliminar</button>}
                </div>

                {mostrarBuscador && (
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar por nombre o apellido..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nuevo estudiante' : `Modificar estudiante #${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Primer nombre<input type="text" required {...campo('pnom_est')} /></label>
                                <label>Segundo nombre<input type="text" {...campo('snom_est')} /></label>
                                <label>Primer apellido<input type="text" required {...campo('pape_est')} /></label>
                                <label>Segundo apellido<input type="text" {...campo('sape_est')} /></label>
                                <label>Sexo
                                    <select {...campo('sexo_est')}>
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                    </select>
                                </label>
                                <label>Teléfono<input type="text" {...campo('tel_est')} /></label>
                                <label>Correo<input type="email" {...campo('cor_est')} /></label>
                                <label>Estado
                                    <select {...campo('estado')}>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn">Guardar</button>
                                <button type="button" className="btn secondary" onClick={() => setModo(null)}>Cancelar</button>
                            </div>
                        </form>
                </Modal>

                <h2 style={{ marginTop: 22 }}>Listado</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Nombre</th><th>Apellido</th><th>Sexo</th>
                            <th>Teléfono</th><th>Correo</th><th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrosFiltrados.map(r => (
                            <tr key={r.id_est}
                                className={String(r.id_est) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.id_est)}>
                                <td>{r.id_est}</td>
                                <td>{r.pnom_est} {r.snom_est}</td>
                                <td>{r.pape_est} {r.sape_est}</td>
                                <td>{r.sexo_est}</td>
                                <td>{r.tel_est}</td>
                                <td>{r.cor_est}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay estudiantes para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}