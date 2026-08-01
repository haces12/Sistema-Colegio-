const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from empleado',(err,empleado) =>{
            if(err){
                res.json(err);
            }
            res.json(empleado);
        });

    });

};

controller.edit = (req, res) => {

    const {id_emp}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from empleado where id_emp=?', [id_emp], (err,empleado) => {
            res.json(empleado[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into empleado set?', [data], (err,empleado) => {
        res.json(empleado);
       });
   })
};

controller.update = (req,res) =>{

    const {id_emp}= req.params;
    const nuevo_empleado = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update empleado set ? where id_emp =?', [nuevo_empleado, id_emp], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_emp}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update empleado set estado = "INACTIVO" where id_emp=?', [id_emp], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;