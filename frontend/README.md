# Frontend React — Colegio

## Instalar y correr

```bash
cd frontend
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Asegúrate de que el backend (`node app.js`)
esté corriendo en `http://localhost:3000` — el CORS de `app.js` ya está
configurado para aceptar `http://localhost:5173`.

## Estructura

```
src/
  api.js                 -> URL base de la API, sesión, fetch con token
  context/AuthContext.jsx -> login/logout compartido en toda la app
  components/
    Sidebar.jsx          -> menú lateral plegable (icono ⇄ icono+texto)
    Layout.jsx            -> arma sidebar + contenido de la página activa
    ProtectedRoute.jsx    -> redirige a /login si no hay sesión
  pages/
    Login.jsx
    Estudiante.jsx        -> Consultar / Ingresar / Modificar / Eliminar
    Matricula.jsx         -> igual, con selects de Estudiante y Curso
  styles.css              -> mismo tema visual (chalkboard + ledger)
```

## Credenciales de prueba

| Usuario | Contraseña | Ve "Eliminar" |
|---|---|---|
| admin | dba1 | Sí |
| prof_guia | prof1 | No |

(Debe existir la tabla `usuarios` en tu base `colegio` con esas filas.)

## Ajustes rápidos

- **Puerto del frontend distinto:** si Vite abre en otro puerto (por
  ejemplo si el 5173 está ocupado), copia esa URL y actualiza el
  `origin` en `backend/app.js`.
- **Usuario sin permiso de eliminar:** edita `USUARIOS_SIN_ELIMINAR`
  en `src/api.js`.
