const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from clase',(err,clase) =>{
            if(err){
                res.json(err);
            }
            res.json(clase);
        });

    });

};

controller.edit = (req, res) => {

    const {cod_cl  }= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from clase where cod_cl =?', [cod_cl ], (err,clase) => {
            res.json(clase[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into clase set?', [data], (err,clase) => {
        res.json(clase);
       });
   })
};

controller.update = (req,res) =>{

    const {cod_cl  }= req.params;
    const nuevo_clase = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update clase set ? where cod_cl =?', [nuevo_clase, cod_cl ], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {cod_cl  }= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update clase set estado = "INACTIVO" where cod_cl=?', [cod_cl ], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;