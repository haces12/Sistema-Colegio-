const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from roles',(err,roles) =>{
            if(err){
                res.json(err);
            }
            res.json(roles);
        });

    });

};

controller.edit = (req, res) => {

    const {id_roles}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from roles where id_roles=?', [id_roles], (err,roles) => {
            res.json(roles[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into roles set?', [data], (err,roles) => {
        res.json(roles);
       });
   })
};

controller.update = (req,res) =>{

    const {id_roles}= req.params;
    const nuevo_roles = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update roles set ? where id_roles =?', [nuevo_roles, id_roles], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {id_roles}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('update roles set estado = "INACTIVO" where id_roles=?', [id_roles], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;