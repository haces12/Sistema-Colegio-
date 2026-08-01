import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeEliminar, puedeModificar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const RECURSO = 'curso';

const VACIO = {
    nom_cur: '', descrip_cur: '', horas_cur: '', creditos_cur: '',
    id_emp: '', estado: 'Activo'
};

export default function Curso() {
    const { sesion } = useAuth();
    const mostrarEliminar = puedeEliminar(sesion);
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

    function nombreEncargado(id) {
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
            const data = await apiFetch('/curso');
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
        : registros.filter(r => normalizarTexto(r.nom_cur).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    async function abrirIngresar() {
        setMsg(null);
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
            setMsg({ texto: 'Selecciona un curso de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.cod_cur) === String(seleccionadoId));
        if (!r) return;
        setForm({
            nom_cur: r.nom_cur || '', descrip_cur: r.descrip_cur || '',
            horas_cur: r.horas_cur ?? '', creditos_cur: r.creditos_cur ?? '',
            id_emp: r.id_emp || '', estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!mostrarEliminar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un curso de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja el curso #${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/curso/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'El curso fue dado de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                await apiFetch('/curso', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Curso ingresado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'El curso fue ingresado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar' && mostrarModificar) {
                await apiFetch(`/curso/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Curso actualizado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'El curso fue actualizado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                <h1>Cursos</h1>
            </div>

            <div className="card panel">
                {msg && <div className={`msg ${msg.tipo}`}>{msg.texto}</div>}

                <div className="toolbar">
        
                    <button className="btn" onClick={abrirIngresar}>Ingresar</button>
                    {mostrarModificar && <button className="btn" onClick={abrirModificar}>Modificar</button>}
                    {mostrarEliminar && <button className="btn danger" onClick={eliminar}>Eliminar</button>}
                </div>

                {mostrarBuscador && (
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar por nombre de curso..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nuevo curso' : `Modificar curso #${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Nombre<input type="text" required {...campo('nom_cur')} /></label>
                                <label>Descripción<input type="text" {...campo('descrip_cur')} /></label>
                                <label>Horas<input type="number" min="0" required {...campo('horas_cur')} /></label>
                                <label>Créditos<input type="number" min="0" required {...campo('creditos_cur')} /></label>
                                <label>Encargado
                                    <select {...campo('id_emp')} required>
                                        {empleados.map(e => (
                                            <option key={e.id_emp} value={e.id_emp}>{e.pnom_emp} {e.pape_emp}</option>
                                        ))}
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
                            <th>ID</th><th>Nombre</th><th>Descripción</th>
                            <th>Horas</th><th>Créditos</th><th>Encargado</th><th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrosFiltrados.map(r => (
                            <tr key={r.cod_cur}
                                className={String(r.cod_cur) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.cod_cur)}>
                                <td>{r.cod_cur}</td>
                                <td>{r.nom_cur}</td>
                                <td>{r.descrip_cur}</td>
                                <td>{r.horas_cur}</td>
                                <td>{r.creditos_cur}</td>
                                <td>{nombreEncargado(r.id_emp)}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay cursos para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}