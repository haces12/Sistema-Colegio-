const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const myConnection = require('express-myconnection');

const app = express();


app.set('port', process.env.PORT || 3000);

const config = {
    application: {
        cors: {
            server: [
                {
                   
                    origin: "http://localhost:5173",
                    credentials: true
                }
            ]
        }
    }
};


app.use(cors(config.application.cors.server));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 


app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'S_haces11',
    database: 'colegio2'
}, 'single'));


const aulaRoutes = require('./rutas/aula');
const claseRoutes = require('./rutas/clase');
const empleadoRoutes = require('./rutas/empleado');
const cursoRoutes = require('./rutas/curso');
const estudianteRoutes = require('./rutas/estudiante');
const matriculaRoutes = require('./rutas/matricula');
const videoRoutes = require('./rutas/profesor');
const seccionRoutes = require('./rutas/seccion');
const authRoutes = require('./rutas/auth');
const rolesRoutes = require('./rutas/roles');
const usuarioRoutes = require('./rutas/usuario');

app.use('/estudiante', estudianteRoutes);
app.use('/matricula', matriculaRoutes);
app.use('/curso', cursoRoutes);
app.use('/aula', aulaRoutes);
app.use('/clase', claseRoutes);
app.use('/empleado', empleadoRoutes);
app.use('/profesor', videoRoutes);
app.use('/seccion', seccionRoutes);
app.use('/auth', authRoutes);
app.use('/roles', rolesRoutes);
app.use('/usuario', usuarioRoutes);




app.listen(app.get('port'), () => {
    console.log("SERVIDOR CORRIENDO EN EL PUERTO " + app.get('port'));
});
