const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../connection/connection");

const router = express.Router();

router.post("/login", (req, res) => {
  const { usuario, clave } = req.body;
  db.query("SELECT * FROM usuarios WHERE usuario = ? AND clave = ?", [usuario,clave], (err, usuarios) => {
    if (err) return res.status(500).send("Error");
    if (usuarios.length === 0) return res.status(401).send("Credenciales inválidas");

    const user = usuarios[0];
    if (user.token_activo) return res.status(403).send("Sesión ya activa");

    const token = jwt.sign({ cusuario: user.cusuario, ctipousuario: user.ctipousuario }, "secreto");
    db.query("UPDATE usuarios SET token_activo = ? WHERE cusuario = ?", [token, user.cusuario], err2 => {
      if (err2) return res.status(500).send("Error al guardar token");
      res.json({ token, user });
    });
  });
});

router.post("/logout", (req, res) => {
  const { cusuario } = req.body;
  db.query("UPDATE usuarios SET token_activo = NULL WHERE cusuario = ?", [cusuario], err => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.sendStatus(200);
  });
});

module.exports = router;
