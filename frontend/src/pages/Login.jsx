import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import logoImg from '../logo1.png';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [verClave, setVerClave] = useState(false);
    const [cargando, setCargando] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: usuario.trim(), clave })
            });
            if (!res.ok) {
                const texto = await res.text();
                throw new Error(texto || 'Credenciales inválidas');
            }
            const data = await res.json();
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'No se pudo iniciar sesión');
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="login-wrap">
            <form className="card login-card" onSubmit={onSubmit}>
                <div style={{
                    position: 'absolute',
        top: '-75px',     
        left: '50%',
        transform: 'translateX(-50%)',
        width: '130px',    
        height: '130px',   
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0,0,0,.3)',
        border: '1px solid rgba(255,255,255,.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
                }}>
                    <img 
                        src={logoImg} 
                        alt="Logo Escuela" 
                        style={{ 
                            width: '80%', 
                            height: '80%', 
                            objectFit: 'contain' 
                        }} 
                    />
                </div>
               
                <h1>Iniciar sesión</h1>
                <p className="sub">Ingresa tus credenciales para acceder al menú.</p>

                {error && <div className="msg error">{error}</div>}

                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <label>Usuario
                        <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)}
                               autoComplete="username" required />
                    </label>
                    <label style={{ position: 'relative' }}>Contraseña
                        <input 
                            type={verClave ? "text" : "password"} 
                            value={clave} 
                            onChange={e => setClave(e.target.value)}
                            autoComplete="current-password" 
                            required 
                            style={{ paddingRight: '40px' }} 
                        />
                        <button
                            type="button" 
                            onClick={() => setVerClave(!verClave)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                bottom: '10px', 
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#ccc'
                            }}
                        >
                       <i className={verClave ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                        </button>
                    </label>
                </div>

                <button type="submit" className="btn1" style={{ width: '100%' }} disabled={cargando}>
                    {cargando ? 'Entrando…' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}