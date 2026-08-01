const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from seccion',(err,seccion) =>{
            if(err){
                res.json(err);
            }
            res.json(seccion);
        });

    });

};

controller.edit = (req, res) => {

    const {cod_sec}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from seccion where cod_sec=?', [cod_sec], (err,seccion) => {
            res.json(seccion[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into seccion set?', [data], (err,seccion) => {
        res.json(seccion);
       });
   })
};

controller.update = (req,res) =>{

    const {cod_sec}= req.params;
    const nuevo_seccion  = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update seccion set ? where cod_sec =?', [nuevo_seccion, cod_sec], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {cod_sec}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update seccion set estado = "INACTIVO" where cod_sec=?', [cod_sec], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;