import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeEliminar, puedeModificar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const RECURSO = 'clase';

const VACIO = {
    nom_cl: '', horario_cl: '', dias_cl: '', modalidad_cl: 'Presencial',
    cod_sec: '', id_emp: '', cod_aula: '', estado: 'Activo'
};

export default function Clase() {
    const { sesion } = useAuth();
    const mostrarEliminar = puedeEliminar(sesion);
    const mostrarModificar = puedeModificar(sesion, RECURSO);

    const [registros, setRegistros] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modo, setModo] = useState(null); 
    const [form, setForm] = useState(VACIO);
    const [msg, setMsg] = useState(null);
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');

    function nombreSeccion(id) {
        const s = secciones.find(x => String(x.cod_sec) === String(id));
        return s ? `${s.cod_sec} (${s.edificio_sec || ''} ${s.aula_sec || ''})`.trim() : `#${id}`;
    }
    function nombreProfesor(id) {
        const p = profesores.find(x => String(x.id_emp) === String(id));
        if (!p) return `#${id}`;
        const nombre = (p.pnom_emp || p.pape_emp) ? `${p.pnom_emp || ''} ${p.pape_emp || ''}`.trim() : `Profesor #${p.id_emp}`;
        return p.especialidad_pr ? `${nombre} — ${p.especialidad_pr}` : nombre;
    }
    function nombreAula(id) {
        const a = aulas.find(x => String(x.cod_aula) === String(id));
        return a ? `${a.num_aula || ''} (${a.edf_aula || ''})`.trim() : `#${id}`;
    }

    async function cargarListasApoyo() {
        const [sec, prof, aul] = await Promise.all([
            apiFetch('/seccion'), apiFetch('/profesor'), apiFetch('/aula')
        ]);
        setSecciones(sec || []);
        setProfesores(prof || []);
        setAulas(aul || []);
        return { sec: sec || [], prof: prof || [], aul: aul || [] };
    }

    async function consultar() {
        setMsg(null);
        setModo(null);
        try {
            if (!secciones.length || !profesores.length || !aulas.length) await cargarListasApoyo();
            const data = await apiFetch('/clase');
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
        : registros.filter(r => normalizarTexto(`${r.nom_cl} ${nombreProfesor(r.id_emp)} ${nombreSeccion(r.cod_sec)}`).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    async function abrirIngresar() {
        setMsg(null);
        try {
            let sec = secciones, prof = profesores, aul = aulas;
            if (!secciones.length || !profesores.length || !aulas.length) {
                const r = await cargarListasApoyo();
                sec = r.sec; prof = r.prof; aul = r.aul;
            }
            setSeleccionadoId(null);
            setForm({
                ...VACIO,
                cod_sec: sec[0]?.cod_sec || '',
                id_emp: prof[0]?.id_emp || '',
                cod_aula: aul[0]?.cod_aula || ''
            });
            setModo('insertar');
        } catch (err) {
            setMsg({ texto: err.message, tipo: 'error' });
        }
    }

    function abrirModificar() {
        setMsg(null);
        if (!mostrarModificar) return; 
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona una clase de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.cod_cl) === String(seleccionadoId));
        if (!r) return;
        setForm({
            nom_cl: r.nom_cl || '', horario_cl: r.horario_cl || '', dias_cl: r.dias_cl || '',
            modalidad_cl: r.modalidad_cl || 'Presencial', cod_sec: r.cod_sec || '',
            id_emp: r.id_emp || '', cod_aula: r.cod_aula || '', estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!mostrarEliminar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona una clase de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja la clase #${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/clase/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'La clase fue dada de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                await apiFetch('/clase', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Clase ingresada.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'La clase fue ingresada correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar' && mostrarModificar) {
                await apiFetch(`/clase/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Clase actualizada.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'La clase fue actualizada correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                <h1>Clases</h1>
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
                        <input type="text" placeholder="Buscar por nombre, profesor o sección..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nueva clase' : `Modificar clase #${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Nombre<input type="text" required {...campo('nom_cl')} /></label>
                                <label>Horario<input type="text" placeholder="08:00-10:00" required {...campo('horario_cl')} /></label>
                                <label>Días<input type="text" placeholder="Lunes y Miércoles" required {...campo('dias_cl')} /></label>
                                <label>Modalidad
                                    <select {...campo('modalidad_cl')}>
                                        <option value="Presencial">Presencial</option>
                                        <option value="Virtual">Virtual</option>
                                        <option value="Híbrida">Híbrida</option>
                                    </select>
                                </label>
                                <label>Sección
                                    <select {...campo('cod_sec')} required>
                                        {secciones.map(s => (
                                            <option key={s.cod_sec} value={s.cod_sec}>{s.cod_sec}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Profesor
                                    <select {...campo('id_emp')} required>
                                        {profesores.map(p => (
                                            <option key={p.id_emp} value={p.id_emp}>{nombreProfesor(p.id_emp)}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Aula
                                    <select {...campo('cod_aula')} required>
                                        {aulas.map(a => (
                                            <option key={a.cod_aula} value={a.cod_aula}>{nombreAula(a.cod_aula)}</option>
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
                            <th>ID</th><th>Nombre</th><th>Horario</th><th>Días</th>
                            <th>Modalidad</th><th>Sección</th><th>Profesor</th><th>Aula</th><th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrosFiltrados.map(r => (
                            <tr key={r.cod_cl}
                                className={String(r.cod_cl) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.cod_cl)}>
                                <td>{r.cod_cl}</td>
                                <td>{r.nom_cl}</td>
                                <td>{r.horario_cl}</td>
                                <td>{r.dias_cl}</td>
                                <td>{r.modalidad_cl}</td>
                                <td>{nombreSeccion(r.cod_sec)}</td>
                                <td>{nombreProfesor(r.id_emp)}</td>
                                <td>{nombreAula(r.cod_aula)}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay clases para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}