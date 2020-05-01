var mysql      = require('mysql');
require('dotenv').config();

// var connection = mysql.createConnection({
// 	host     : 'remotemysql.com',
// 	port	 :  3306,
// 	user     :  process.env.dbusername,
// 	password :  process.env.dbpassword,
// 	database :  process.env.database
// });
// connection.connect(function(err){
// 	if(!err) {
// 		console.log("Database is connected");
// 	} else {
// 		console.log("Error while connecting with database"+err);
// 	}
// });
var db_config = {
	host     : 'remotemysql.com',
	port	 :  3306,
	user     :  process.env.dbusername,
	password :  process.env.dbpassword,
	database :  process.env.database
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); 
  connection.connect(function(err) {              
    if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }else{
		console.log("Database is connected");
	}                                 
  });                                     
                                          
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                         
    } else {                                      
      throw err;                                  
    }
  });
}

handleDisconnect();

module.exports = connection; 
