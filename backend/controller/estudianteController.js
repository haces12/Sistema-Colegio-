const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from estudiante',(err,estudiante) =>{
            if(err){
                res.json(err);
            }
            res.json(estudiante);
        });

    });

};

controller.edit = (req, res) => {

    const {id_est}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from estudiante where id_est=?', [id_est], (err,estudiante) => {
            res.json(estudiante[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into estudiante set?', [data], (err,estudiante) => {
        res.json(estudiante);
       });
   })
};

controller.update = (req,res) =>{

    const {id_est}= req.params;
    const nuevo_estudiante = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update estudiante set ? where id_est =?', [nuevo_estudiante, id_est], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_est}= req.params; 
  req.getConnection((err,conn) => {
      conn.query(' update estudiante set estado = "INACTIVO" where id_est=?', [id_est], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;