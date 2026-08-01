import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeCrear, puedeEliminar, puedeModificar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const RECURSO = 'profesor';

const VACIO = { id_emp: '', especialidad_pr: '', exp_pr: '', titulo_pr: '', estado: 'Activo' };

export default function Profesor() {
    const { sesion } = useAuth();
    const mostrarIngresar = puedeCrear(sesion, RECURSO);
    const mostrarEliminar = puedeEliminar(sesion, RECURSO);
    const mostrarModificar = puedeModificar(sesion, RECURSO);

    const [registros, setRegistros] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modo, setModo] = useState(null);
    const [form, setForm] = useState(VACIO);
    const [msg, setMsg] = useState(null);
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');

    function nombreEmpleado(id) {
        const e = empleados.find(x => String(x.id_emp) === String(id));
        return e ? `${e.pnom_emp} ${e.pape_emp}` : `#${id}`;
    }

    async function cargarEmpleados() {
        const emp = await apiFetch('/empleado');
        setEmpleados(emp || []);
        return emp || [];
    }

    async function consultar() {
        setMsg(null);
        setModo(null);
        try {
            if (!empleados.length) await cargarEmpleados();
            const data = await apiFetch('/profesor');
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
        : registros.filter(r => normalizarTexto(`${nombreEmpleado(r.id_emp)} ${r.especialidad_pr}`).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    async function abrirIngresar() {
        setMsg(null);
        if (!mostrarIngresar) return;
        try {
            let emp = empleados;
            if (!empleados.length) emp = await cargarEmpleados();
            setSeleccionadoId(null);
            setForm({ ...VACIO, id_emp: emp[0]?.id_emp || '' });
            setModo('insertar');
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        }
    }

    function abrirModificar() {
        setMsg(null);
        if (!mostrarModificar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un profesor de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.id_emp) === String(seleccionadoId));
        if (!r) return;
        setForm({
            id_emp: r.id_emp, especialidad_pr: r.especialidad_pr || '',
            exp_pr: r.exp_pr ?? '', titulo_pr: r.titulo_pr || '', estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!mostrarEliminar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un profesor de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja al profesor #${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/profesor/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'El profesor fue dado de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                await apiFetch('/profesor', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Profesor ingresado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'El profesor fue ingresado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar' && mostrarModificar) {
                await apiFetch(`/profesor/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Profesor actualizado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'El profesor fue actualizado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                <h1>Profesores</h1>
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
                        <input type="text" placeholder="Buscar por nombre o especialidad..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nuevo profesor' : `Modificar profesor #${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Empleado
                                    <select {...campo('id_emp')} required disabled={modo === 'modificar'}>
                                        {empleados.map(e => (
                                            <option key={e.id_emp} value={e.id_emp}>{e.pnom_emp} {e.pape_emp}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Especialidad<input type="text" required {...campo('especialidad_pr')} /></label>
                                <label>Años de experiencia<input type="number" min="0" {...campo('exp_pr')} /></label>
                                <label>Título<input type="text" {...campo('titulo_pr')} /></label>
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
                            <th>ID</th><th>Nombre</th><th>Especialidad</th>
                            <th>Experiencia</th><th>Título</th><th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrosFiltrados.map(r => (
                            <tr key={r.id_emp}
                                className={String(r.id_emp) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.id_emp)}>
                                <td>{r.id_emp}</td>
                                <td>{nombreEmpleado(r.id_emp)}</td>
                                <td>{r.especialidad_pr}</td>
                                <td>{r.exp_pr}</td>
                                <td>{r.titulo_pr}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay profesores para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}