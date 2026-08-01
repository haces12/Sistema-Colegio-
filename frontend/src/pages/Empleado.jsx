import { useEffect, useState } from 'react';
import CoolAlert from 'coolalertjs/dist/coolalert.js';
import { apiFetch, puedeEliminar, puedeModificar, normalizarTexto } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

const RECURSO = 'empleado';

const VACIO = {
    pnom_emp: '', snom_emp: '', pape_emp: '', sape_emp: '',
    sexo_emp: 'M', tel_emp: '', cor_emp: '', estado: 'Activo'
};

export default function Empleado() {
    const { sesion } = useAuth();
    const mostrarEliminar = puedeEliminar(sesion);
    const mostrarModificar = puedeModificar(sesion, RECURSO);

    const [registros, setRegistros] = useState([]);
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modo, setModo] = useState(null);
    const [form, setForm] = useState(VACIO);
    const [msg, setMsg] = useState(null);
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('');

    async function consultar() {
        setMsg(null);
        setModo(null);
        try {
            const data = await apiFetch('/empleado');
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
        : registros.filter(r => normalizarTexto(`${r.pnom_emp} ${r.snom_emp} ${r.pape_emp} ${r.sape_emp}`).includes(normalizarTexto(filtro)));

    useEffect(() => { consultar(); }, []);

    function abrirIngresar() {
        setMsg(null);
        setSeleccionadoId(null);
        setForm(VACIO);
        setModo('insertar');
    }

    function abrirModificar() {
        setMsg(null);
        if (!mostrarModificar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un empleado de la tabla antes de modificar.', tipo: 'error' });
            return;
        }
        const r = registros.find(x => String(x.id_emp) === String(seleccionadoId));
        if (!r) return;
        setForm({
            pnom_emp: r.pnom_emp || '', snom_emp: r.snom_emp || '',
            pape_emp: r.pape_emp || '', sape_emp: r.sape_emp || '',
            sexo_emp: r.sexo_emp || 'M', tel_emp: r.tel_emp || '',
            cor_emp: r.cor_emp || '', estado: r.estado || 'Activo'
        });
        setModo('modificar');
    }

    async function eliminar() {
        setMsg(null);
        if (!mostrarEliminar) return;
        if (!seleccionadoId) {
            setMsg({ texto: 'Selecciona un empleado de la tabla antes de eliminar.', tipo: 'error' });
            return;
        }
        const confirmacion = await CoolAlert.show({
            title: '¿Dar de baja este registro?',
            text: `Esta acción dará de baja al empleado #${seleccionadoId}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacion.isConfirmed) return;
        try {
            await apiFetch(`/empleado/${seleccionadoId}`, { method: 'DELETE' });
            setMsg({ texto: 'Registro eliminado.', tipo: 'ok' });
            CoolAlert.show({ icon: 'success', title: '¡Eliminado!', text: 'El empleado fue dado de baja correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                await apiFetch('/empleado', { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Empleado ingresado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Guardado!', text: 'El empleado fue ingresado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
            } else if (modo === 'modificar' && mostrarModificar) {
                await apiFetch(`/empleado/${seleccionadoId}`, { method: 'POST', body: JSON.stringify(form) });
                setMsg({ texto: 'Empleado actualizado.', tipo: 'ok' });
                CoolAlert.show({ icon: 'success', title: '¡Actualizado!', text: 'El empleado fue actualizado correctamente.', confirmButtonText: 'Aceptar', showCancelButton: false });
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
                <h1>Empleados</h1>
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
                        <input type="text" placeholder="Buscar por nombre o apellido..."
                               value={busqueda} onChange={e => setBusqueda(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && buscar()} />
                        <button className="btn secondary" onClick={buscar}>Consultar</button>
                        {filtro && <button className="btn secondary" onClick={limpiarBusqueda}>Limpiar</button>}
                    </div>
                )}

                <Modal abierto={!!modo} onClose={() => setModo(null)}
                       titulo={modo === 'insertar' ? 'Nuevo empleado' : `Modificar empleado #${seleccionadoId}`}>
                    <form onSubmit={guardar}>
                            <div className="form-grid">
                                <label>Primer nombre<input type="text" required {...campo('pnom_emp')} /></label>
                                <label>Segundo nombre<input type="text" {...campo('snom_emp')} /></label>
                                <label>Primer apellido<input type="text" required {...campo('pape_emp')} /></label>
                                <label>Segundo apellido<input type="text" {...campo('sape_emp')} /></label>
                                <label>Sexo
                                    <select {...campo('sexo_emp')}>
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                    </select>
                                </label>
                                <label>Teléfono<input type="text" {...campo('tel_emp')} /></label>
                                <label>Correo<input type="email" {...campo('cor_emp')} /></label>
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
                            <tr key={r.id_emp}
                                className={String(r.id_emp) === String(seleccionadoId) ? 'selected' : ''}
                                onClick={() => setSeleccionadoId(r.id_emp)}>
                                <td>{r.id_emp}</td>
                                <td>{r.pnom_emp} {r.snom_emp}</td>
                                <td>{r.pape_emp} {r.sape_emp}</td>
                                <td>{r.sexo_emp}</td>
                                <td>{r.tel_emp}</td>
                                <td>{r.cor_emp}</td>
                                <td><span className={`estado-pill ${(r.estado||'').toLowerCase()==='activo'?'activo':'inactivo'}`}>{r.estado}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrosFiltrados.length === 0 && (
                    <div className="empty">
                        {filtro ? `Sin resultados para "${filtro}".` : 'No hay empleados para mostrar. Presiona "Consultar".'}
                    </div>
                )}
            </div>
        </div>
    );
}