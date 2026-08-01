import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeEliminar, puedeModificar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const RECURSO = 'seccion';

const VACIO = {
    cod_sec: '', cupomax_sec: '', edificio_sec: '', aula_sec: '',
    cod_cur: '', estado: 'Activo'
};

export default function Seccion() {
    const { sesion } = useAuth();
    const mostrarEliminar = puedeEliminar(sesion);
    const mostrarModificar = puedeModificar(sesion, RECURSO);

    const [registros, setRegistros] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modo, setModo] = useState(null);
    const [form, setForm] = useState(VACIO);
    const [msg, setMsg] = useState(null);
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');

    function nombreCurso(id) {
        const c = cursos.find(x => String(x.cod_cur) === String(id));
        return c ? c.nom_cur : `#${id}`;
    }

    async function cargarCursos() {
        const cur = await apiFetch('/curso');
        setCursos(cur || []);
        return cur || [];
    }

    async function consultar() {
        setMsg(null);
        setModo(null);
        try {
            if (!cursos.length) await cargarCursos();
            const data = await apiFetch('/seccion');
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
        : registros.filter(r => normalizarTexto(`${r.cod_sec} ${nombreCurso(r.cod_cur)}`).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    async function abrirIngresar() {
        setMsg(null);
        try {
            let cur = cursos;
            if (!cursos.length) cur = await cargarCursos();
            setSeleccionadoId(null);
            setForm({ ...VACIO, cod_cur: cur[0]?.cod_cur || '' });
            setModo('insertar');
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        }
    }

    function abrirModificar() {
        setMsg(null);
        if (!mostrarModificar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona una sección de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.cod_sec) === String(seleccionadoId));
        if (!r) return;
        setForm({
            cod_sec: r.cod_sec || '', cupomax_sec: r.cupomax_sec ?? '',
            edificio_sec: r.edificio_sec || '', aula_sec: r.aula_sec || '',
            cod_cur: r.cod_cur || '', estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!mostrarEliminar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona una sección de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja la sección ${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/seccion/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'La sección fue dada de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                await apiFetch('/seccion', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Sección ingresada.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'La sección fue ingresada correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar' && mostrarModificar) {
                await apiFetch(`/seccion/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Sección actualizada.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'La sección fue actualizada correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                <h1>Secciones</h1>
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
                        <input type="text" placeholder="Buscar por código o curso..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nueva sección' : `Modificar sección ${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Código
                                    <input type="text" required disabled={modo === 'modificar'}
                                           placeholder="SEC-101" {...campo('cod_sec')} />
                                </label>
                                <label>Cupo máximo<input type="number" min="1" required {...campo('cupomax_sec')} /></label>
                                <label>Edificio<input type="text" {...campo('edificio_sec')} /></label>
                                <label>Aula<input type="text" {...campo('aula_sec')} /></label>
                                <label>Curso
                                    <select {...campo('cod_cur')} required>
                                        {cursos.map(c => (
                                            <option key={c.cod_cur} value={c.cod_cur}>{c.nom_cur}</option>
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
                            <th>Código</th><th>Cupo</th><th>Edificio</th>
                            <th>Aula</th><th>Curso</th><th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrosFiltrados.map(r => (
                            <tr key={r.cod_sec}
                                className={String(r.cod_sec) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.cod_sec)}>
                                <td>{r.cod_sec}</td>
                                <td>{r.cupomax_sec}</td>
                                <td>{r.edificio_sec}</td>
                                <td>{r.aula_sec}</td>
                                <td>{nombreCurso(r.cod_cur)}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay secciones para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}