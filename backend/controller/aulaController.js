const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from aula',(err,aula) =>{
            if(err){
                res.json(err);
            }
            res.json(aula);
        });

    });

};

controller.edit = (req, res) => {

    const {id_aula}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from aula where cod_aula=?', [id_aula], (err,aula) => {
            res.json(aula[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into aula set?', [data], (err,aula) => {
        res.json(aula);
       });
   })
};

controller.update = (req,res) =>{

    const {id_aula}= req.params;
    const nuevo_aula = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update aula set ? where cod_aula =?', [nuevo_aula, id_aula], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_aula}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update aula set estado = "INACTIVO" where cod_aula=?', [id_aula  ], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;