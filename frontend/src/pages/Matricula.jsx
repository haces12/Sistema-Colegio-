import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeCrear, puedeModificar, puedeEliminar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const RECURSO = 'matricula';

function hoy() { return new Date().toISOString().slice(0, 10); }

const VACIO = {
    id_est: '', cod_cur: '', fecha_mat: hoy(),
    costo_mat: '', estado_mat: 'Pendiente', estado: 'Activo'
};

export default function Matricula() {
    const { sesion } = useAuth();
    const mostrarIngresar = puedeCrear(sesion, RECURSO);
    const mostrarModificar = puedeModificar(sesion, RECURSO);
    const mostrarEliminar = puedeEliminar(sesion, RECURSO);

    const [registros, setRegistros] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modo, setModo] = useState(null);
    const [form, setForm] = useState(VACIO);
    const [msg, setMsg] = useState(null);
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');

    function nombreEstudiante(id) {
        const e = estudiantes.find(x => String(x.id_est) === String(id));
        return e ? `${e.pnom_est} ${e.pape_est}` : `#${id}`;
    }
    function nombreCurso(id) {
        const c = cursos.find(x => String(x.cod_cur) === String(id));
        return c ? c.nom_cur : `#${id}`;
    }

    async function cargarListasApoyo() {
        const [est, cur] = await Promise.all([apiFetch('/estudiante'), apiFetch('/curso')]);
        setEstudiantes(est || []);
        setCursos(cur || []);
        return { est: est || [], cur: cur || [] };
    }

    async function consultar() {
        setMsg(null);
        setModo(null);
        try {
            if (!estudiantes.length || !cursos.length) await cargarListasApoyo();
            const data = await apiFetch('/matricula');
            setRegistros(data || []);
            setMostrarBuscador(true);
            setBusqueda('');
            setFiltro('');
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        }
    }

    function buscar() { setFiltro(busqueda); }
    function limpiarBusqueda() { setBusqueda(''); setFiltro(''); }

    const registrosFiltrados = filtro.trim() === ''
        ? registros
        : registros.filter(r => normalizarTexto(`${nombreEstudiante(r.id_est)} ${nombreCurso(r.cod_cur)}`).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    async function abrirIngresar() {
        setMsg(null);
        if (!mostrarIngresar) return;
        try {
            let list = estudiantes, curl = cursos;
            if (!estudiantes.length || !cursos.length) {
                const r = await cargarListasApoyo();
                list = r.est; curl = r.cur;
            }
            setSeleccionadoId(null);
            setForm({ ...VACIO, id_est: list[0]?.id_est || '', cod_cur: curl[0]?.cod_cur || '', fecha_mat: hoy() });
            setModo('insertar');
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        }
    }

    function abrirModificar() {
        setMsg(null);
        if (!mostrarModificar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona una matrícula de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.id_mat) === String(seleccionadoId));
        if (!r) return;
        setForm({
            id_est: r.id_est, cod_cur: r.cod_cur,
            fecha_mat: r.fecha_mat ? String(r.fecha_mat).slice(0, 10) : hoy(),
            costo_mat: r.costo_mat ?? '', estado_mat: r.estado_mat || 'Pendiente',
            estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!mostrarEliminar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona una matrícula de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja la matrícula #${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/matricula/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'La matrícula fue dada de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
            if (modo === 'insertar' && mostrarIngresar) {
                await apiFetch('/matricula', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Matrícula ingresada.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'La matrícula fue ingresada correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar' && mostrarModificar) {
                await apiFetch(`/matricula/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Matrícula actualizada.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'La matrícula fue actualizada correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                <h1>Matrícula</h1>
            </div>

            <div className="card panel">
                {msg && <div className={`msg ${msg.tipo}`}>{msg.texto}</div>}

                <div className="toolbar">
                    
                    {mostrarIngresar && <button className="btn" onClick={abrirIngresar}>Ingresar</button>}
                    {mostrarModificar && <button className="btn" onClick={abrirModificar}>Modificar</button>}
                    {mostrarEliminar && <button className="btn danger" onClick={eliminar}>Eliminar</button>}
                </div>

                {mostrarBuscador && (
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar por estudiante o curso..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nueva matrícula' : `Modificar matrícula #${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Estudiante
                                    <select {...campo('id_est')} required>
                                        {estudiantes.map(e => (
                                            <option key={e.id_est} value={e.id_est}>{e.pnom_est} {e.pape_est}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Curso
                                    <select {...campo('cod_cur')} required>
                                        {cursos.map(c => (
                                            <option key={c.cod_cur} value={c.cod_cur}>{c.nom_cur}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Fecha<input type="date" required {...campo('fecha_mat')} /></label>
                                <label>Costo<input type="number" step="0.01" required {...campo('costo_mat')} /></label>
                                <label>Estado de pago
                                    <select {...campo('estado_mat')}>
                                        <option value="Pagada">Pagada</option>
                                        <option value="Pendiente">Pendiente</option>
                                    </select>
                                </label>
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
                            <th>ID</th><th>Estudiante</th><th>Curso</th><th>Fecha</th>
                            <th>Costo</th><th>Pago</th><th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrosFiltrados.map(r => (
                            <tr key={r.id_mat}
                                className={String(r.id_mat) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.id_mat)}>
                                <td>{r.id_mat}</td>
                                <td>{nombreEstudiante(r.id_est)}</td>
                                <td>{nombreCurso(r.cod_cur)}</td>
                                <td>{r.fecha_mat ? String(r.fecha_mat).slice(0, 10) : ''}</td>
                                <td>{r.costo_mat ?? ''}</td>
                                <td>{r.estado_mat}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay matrículas para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}