const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from usuario',(err,usuario) =>{
            if(err){
                res.json(err);
            }
            res.json(usuario);
        });

    });

};

controller.edit = (req, res) => {

    const {id_usuario}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from usuario where id_usuario=?', [id_usuario], (err,usuario) => {
            res.json(usuario[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into usuario set?', [data], (err,usuario) => {
        res.json(usuario);
       });
   })
};

controller.update = (req,res) =>{

    const {id_usuario}= req.params;
    const nuevo_usuario = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update usuario set ? where id_usuario =?', [nuevo_usuario, id_usuario], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_usuario}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update usuario set estado = "INACTIVO" where id_usuario=?', [id_usuario], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
