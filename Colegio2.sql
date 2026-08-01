
CREATE DATABASE colegio2;

USE colegio2;
CREATE TABLE estudiante(
    id_est INT AUTO_INCREMENT PRIMARY KEY,
    pnom_est VARCHAR(30) NOT NULL,
    snom_est VARCHAR(30),
    pape_est VARCHAR(30) NOT NULL,
    sape_est VARCHAR(30),
    sexo_est CHAR(1),
    tel_est VARCHAR(15),
    cor_est VARCHAR(80),
    estado VARCHAR(14)
);
CREATE TABLE empleado(

id_emp INT AUTO_INCREMENT PRIMARY KEY,
pnom_emp VARCHAR(30),
snom_emp VARCHAR(30),
pape_emp VARCHAR(30),
sape_emp VARCHAR(30),
sexo_emp CHAR(1),
tel_emp VARCHAR(15),
cor_emp VARCHAR(80),
estado VARCHAR(14)
);
CREATE TABLE profesor(

id_emp INT PRIMARY KEY,
especialidad_pr VARCHAR(60),
exp_pr INT,
titulo_pr VARCHAR(80),
estado VARCHAR(14),
FOREIGN KEY(id_emp)
REFERENCES empleado(id_emp)

);
CREATE TABLE curso(
    cod_cur INT AUTO_INCREMENT PRIMARY KEY,
    nom_cur VARCHAR(60),
    descrip_cur VARCHAR(150),
    horas_cur INT,
    creditos_cur INT,
    id_emp int,
    estado VARCHAR(14),
    FOREIGN KEY(id_emp)
    REFERENCES empleado(id_emp)

);
CREATE TABLE seccion(

cod_sec VARCHAR(15) PRIMARY KEY,
cupomax_sec INT,
edificio_sec VARCHAR(30),
aula_sec VARCHAR(20),
cod_cur INT,
estado VARCHAR(14),
FOREIGN KEY(cod_cur)
REFERENCES curso(cod_cur)
);
CREATE TABLE matricula(
    id_mat INT AUTO_INCREMENT PRIMARY KEY,
    fecha_mat DATE,
    costo_mat DECIMAL(10,2),
    estado_mat VARCHAR(20),
    id_est INT,
    cod_cur INT,
    estado VARCHAR(14),
    FOREIGN KEY(id_est)
        REFERENCES estudiante(id_est),
    FOREIGN KEY(cod_cur)
        REFERENCES curso(cod_cur)
);
CREATE TABLE aula(

cod_aula INT AUTO_INCREMENT PRIMARY KEY,
num_aula VARCHAR(20),
edf_aula VARCHAR(20),
piso_aula INT,
cap_aula INT,
estado VARCHAR(14)
);

CREATE TABLE clase(

cod_cl INT AUTO_INCREMENT PRIMARY KEY,
nom_cl VARCHAR(60),
horario_cl VARCHAR(40),
dias_cl VARCHAR(40),
modalidad_cl VARCHAR(30),
cod_sec VARCHAR(15),
id_emp INT,
cod_aula INT,
estado VARCHAR(14),
FOREIGN KEY(cod_sec)
REFERENCES seccion(cod_sec),
FOREIGN KEY(id_emp)
REFERENCES profesor(id_emp),
FOREIGN KEY(cod_aula)
REFERENCES aula(cod_aula)

);
CREATE USER 'Admin1'@'localhost'
IDENTIFIED BY 'dba1';

GRANT ALL PRIVILEGES
ON colegio2.*
TO 'Admin1'@'localhost';
FLUSH PRIVILEGES;
CREATE USER 'prof_guia1'@'localhost'
IDENTIFIED BY 'prof1';
GRANT SELECT,INSERT,UPDATE
ON colegio2.estudiante
TO 'prof_guia1'@'localhost';
GRANT INSERT
ON colegio2.clase
TO 'prof_guia1'@'localhost';
GRANT SELECT,INSERT,UPDATE
ON colegio2.matricula
TO 'prof_guia1'@'localhost';

CREATE TABLE usuarios(
    cusuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(30) NOT NULL UNIQUE,
    clave VARCHAR(30) NOT NULL,
    ctipousuario INT,
    token_activo VARCHAR(255)
);
INSERT INTO usuarios (usuario, clave, ctipousuario) VALUES
('admin', 'dba1', 1),
('prof_guia', 'prof1', 2);
UPDATE usuarios SET token_activo = NULL WHERE usuario = 'admin';
-- ==========================
-- ESTUDIANTE
-- ==========================
INSERT INTO estudiante
(pnom_est, snom_est, pape_est, sape_est, sexo_est, tel_est, cor_est, estado)
VALUES
('Carlos', 'Alberto', 'Martinez', 'Lopez', 'M', '98765432', 'carlos@gmail.com', 'Activo'),
('María', 'Fernanda', 'Gomez', 'Castro', 'F', '99887766', 'maria@gmail.com', 'Activo');

-- ==========================
-- EMPLEADO
-- ==========================
INSERT INTO empleado
(pnom_emp, snom_emp, pape_emp, sape_emp, sexo_emp, tel_emp, cor_emp, estado)
VALUES
('Juan', 'José', 'Pérez', 'Ramirez', 'M', '99990011', 'juan@universidad.edu', 'Activo'),
('Ana', 'Lucía', 'Santos', 'Mejia', 'F', '99990022', 'ana@universidad.edu', 'Activo');

-- ==========================
-- PROFESOR
-- ==========================
INSERT INTO profesor
(id_emp, especialidad_pr, exp_pr, titulo_pr, estado)
VALUES
(1, 'Ingeniería en Sistemas', 10, 'Máster en Informática', 'Activo'),
(2, 'Matemáticas', 8, 'Licenciada en Matemáticas', 'Activo');

-- ==========================
-- CURSO
-- ==========================
INSERT INTO curso
(nom_cur, descrip_cur, horas_cur, creditos_cur, id_emp, estado)
VALUES
('Base de Datos', 'Diseño y administración de bases de datos', 60, 4, 1, 'Activo'),
('Programación I', 'Fundamentos de programación', 80, 5, 2, 'Activo');

-- ==========================
-- SECCION
-- ==========================
INSERT INTO seccion
(cod_sec, cupomax_sec, edificio_sec, aula_sec, cod_cur, estado)
VALUES
('BD-101', 30, 'Edificio A', 'A101', 1, 'Activo'),
('PR-102', 35, 'Edificio B', 'B201', 2, 'Activo');

-- ==========================
-- MATRICULA
-- ==========================
INSERT INTO matricula
(fecha_mat, costo_mat, estado_mat, id_est, cod_cur, estado)
VALUES
('2026-07-31', 2500.00, 'Pagada', 1, 1, 'Activo'),
('2026-07-31', 2800.00, 'Pendiente', 2, 2, 'Activo');

-- ==========================
-- AULA
-- ==========================
INSERT INTO aula
(num_aula, edf_aula, piso_aula, cap_aula, estado)
VALUES
('101', 'Edificio A', 1, 35, 'Activo'),
('201', 'Edificio B', 2, 40, 'Activo');

-- ==========================
-- CLASE
-- ==========================
INSERT INTO clase
(nom_cl, horario_cl, dias_cl, modalidad_cl, cod_sec, id_emp, cod_aula, estado)
VALUES
('Base de Datos - Grupo A', '08:00-10:00', 'Lunes y Miércoles', 'Presencial', 'BD-101', 1, 1, 'Activo'),
('Programación I - Grupo A', '10:00-12:00', 'Martes y Jueves', 'Presencial', 'PR-102', 2, 2, 'Activo');

select *from estudiante;
