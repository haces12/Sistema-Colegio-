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

 |Usuario	   | Contraseña    |   	Rol        |
 |admin	     |  dba1     	  |  Administrador |
 |prof_guia	 | prof1        |  	Profesor guía |
