const signale = require('signale');
const mysql = require('mysql');

// Overrides any existing `package.json` config
signale.config({
  displayFilename: false,
  displayTimestamp: true,
  displayDate: false
}); 

signale.success('packages loaded');

//creates a connection to the database
var databse = mysql.createConnection({
  host:"localhost",
  port:'3306',
  user:"root",
  database:"bamazon"
});

//init the connection and returns any errors
databse.connect(function(error){
  if(error) throw error;
signale.success('mysql loaded');
});

