  Sistema de Gestión Escolar

Sistema web para la gestión de información académica y administrativa de
una institución educativa.

El proyecto fue desarrollado como una aplicación **Full Stack**, separando
el frontend y el backend, con una base de datos relacional en MySQL.

---

##  Descripción

Este sistema permite administrar diferentes áreas de una institución
educativa desde una interfaz web.

La aplicación cuenta con autenticación de usuarios, control de acceso
según el rol y operaciones de consulta, registro, modificación y baja
de información.

El sistema está organizado en tres partes principales:

- **Frontend:** Aplicación web desarrollada con React y Vite.
- **Backend:** API desarrollada con Node.js y Express.
- **Base de datos:** MySQL con relaciones entre las diferentes entidades.

---

##  Funcionalidades

###  Autenticación

- Inicio de sesión mediante usuario y contraseña.
- Generación de tokens mediante JWT.
- Control de sesión activa.
- Cierre de sesión.
- Protección de rutas mediante `ProtectedRoute`.
- Persistencia de la sesión utilizando `localStorage`.

###  Control de roles

El sistema actualmente trabaja con diferentes tipos de usuario y permisos.

#### Administrador

Cuenta con acceso completo a los módulos disponibles:

- Consultar
- Crear
- Modificar
- Eliminar / dar de baja

#### Profesor guía

Cuenta con permisos específicos según el módulo:

- Consultar estudiantes
- Crear estudiantes
- Modificar estudiantes
- Consultar matrículas
- Consultar y crear clases
- Consultar profesores

Los permisos se controlan desde el frontend mediante el sistema de roles
implementado en `api.js`.

---

##  Módulos del sistema

El sistema cuenta con los siguientes módulos:

| Módulo | Descripción |
|---|---|
|  Estudiantes | Gestión de estudiantes |
|  Matrículas | Gestión de matrículas y estados de pago |
| Clases | Gestión de clases |
| Profesores | Gestión de profesores |
|  Cursos | Gestión de cursos |
| Empleados | Gestión de empleados |
| Secciones | Gestión de secciones |
|  Aulas | Gestión de aulas |
| Dashboard | Resumen de información del sistema |

Los diferentes módulos permiten realizar operaciones sobre los registros
según los permisos del usuario.

---

##  Dashboard

El sistema incluye un panel principal que muestra información resumida
de los módulos disponibles para el usuario.

El dashboard permite visualizar:

- Cantidad de estudiantes
- Cantidad de matrículas
- Cantidad de clases
- Cantidad de cursos
- Cantidad de profesores
- Cantidad de empleados
- Cantidad de secciones
- Cantidad de aulas
- Registros activos

También incluye un resumen de matrículas con:

- Matrículas pagadas
- Matrículas pendientes
- Total recaudado

Las estadísticas mostradas dependen de los permisos correspondientes
al rol del usuario.

---

##  Tecnologías utilizadas

### Frontend

- React 18
- Vite
- React Router DOM
- Bootstrap 5
- Bootstrap Icons
- Lucide React
- CoolAlertJS
- JavaScript / JSX
- CSS

### Backend

- Node.js
- Express 5
- MySQL
- MySQL2
- Express MyConnection
- JSON Web Token (JWT)
- CORS
- Morgan

### Base de datos

- MySQL
- SQL
- Claves primarias
- Claves foráneas
- Relaciones entre tablas
- Usuarios y roles

  El proyecto utiliza una arquitectura separada entre frontend y backend:

```text
                    ┌─────────────────────┐
                    │      Usuario        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       React         │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                         HTTP / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js / Express │
                    │        API          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      colegio2       │
```

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | dba1 | Administrador |
| prof_guia | prof1 | Profesor guía |

#Imagenes
![Banner de Colegio](https://private-user-images.githubusercontent.com/130525712/643308280-829a369e-d15c-49d1-adaa-90a9a103b388.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxNDI4NTMsIm5iZiI6MTc4ODE0MjU1MywicGF0aCI6Ii8xMzA1MjU3MTIvNjQzMzA4MjgwLTgyOWEzNjllLWQxNWMtNDlkMS1hZGFhLTkwYTlhMTAzYjM4OC5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDgzMSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjA4MzFUMDIxNTUzWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MmFlZTFlYzNlZWEwY2M5MDIzZTNmNzRkOTFiM2RjNzdkOGQzYWE2MzgwMzYwMjU4Y2VmMWM5MzA4MjAyOGQwMiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmcmVzcG9uc2UtY29udGVudC10eXBlPWltYWdlJTJGanBlZyJ9.IOeA4dDtYdVuDQTuQ0cpJP7NiIvjc_g2YqWOIUrmZ_4)

![Banner de Colegio2](https://private-user-images.githubusercontent.com/130525712/643307680-6598650d-4490-4f6c-9258-7cc205678d4d.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxNDI5MDgsIm5iZiI6MTc4ODE0MjYwOCwicGF0aCI6Ii8xMzA1MjU3MTIvNjQzMzA3NjgwLTY1OTg2NTBkLTQ0OTAtNGY2Yy05MjU4LTdjYzIwNTY3OGQ0ZC5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDgzMSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjA4MzFUMDIxNjQ4WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9M2FlZTg0MzU0ODE5YmFhY2QwMjM2NmFjMzY5MjI5OTQ3MDhiY2ZkZjAzMzVhY2IzMWJjMzVjZmExMzNlZGQwZSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmcmVzcG9uc2UtY29udGVudC10eXBlPWltYWdlJTJGanBlZyJ9.QxUlvQB269ziO1TiBIlsCnGb7bhs97RTbUVNmyUl6rU)
