const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from profesor',(err,profesor) =>{
            if(err){
                res.json(err);
            }
            res.json(profesor);
        });

    });

};

controller.edit = (req, res) => {

    const {id_emp}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from profesor where id_emp=?', [id_emp], (err,profesor) => {
            res.json(profesor[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into profesor set?', [data], (err,profesor) => {
        res.json(profesor);
       });
   })
};

controller.update = (req,res) =>{

    const {id_emp}= req.params;
    const nuevo_profesor = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update profesor set ? where id_emp =?', [nuevo_profesor, id_emp], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_emp}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update profesor set estado = "INACTIVO" where id_emp=?', [id_emp], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;