const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from matricula',(err,matricula) =>{
            if(err){
                res.json(err);
            }
            res.json(matricula);
        });

    });

};

controller.edit = (req, res) => {

    const {id_mat}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from matricula where id_mat=?', [id_mat], (err,matricula) => {
            res.json(matricula[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into matricula set?', [data], (err,matricula) => {
        res.json(matricula);
       });
   })
};

controller.update = (req,res) =>{

    const {id_mat}= req.params;
    const nuevo_matricula = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update matricula set ? where id_mat =?', [nuevo_matricula, id_mat], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_mat}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update matricula set estado = "INACTIVO" where id_mat=?', [id_mat], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;