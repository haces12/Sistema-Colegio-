const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'S_haces11',
  database: 'colegio2',
  port: '3306'
});

mysqlConnection.connect( err => {
  if(err){
    console.log('Error en db: ', err);
    return;
  }else{
    console.log('Database ok');
  }
});

module.exports = mysqlConnection;
