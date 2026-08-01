const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from curso',(err,curso) =>{
            if(err){
                res.json(err);
            }
            res.json(curso);
        });

    });

};

controller.edit = (req, res) => {

    const {cod_cur}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from curso where cod_cur =?', [cod_cur], (err,curso) => {
            res.json(curso[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into curso set?', [data], (err,curso) => {
        res.json(curso);
       });
   })
};

controller.update = (req,res) =>{

    const {cod_cur}= req.params;
    const nuevo_curso = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update curso set ? where cod_cur =?', [nuevo_curso, cod_cur], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {cod_cur}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update curso set estado = "INACTIVO" where cod_cur=?', [cod_cur], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;