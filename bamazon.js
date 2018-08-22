const signale = require('signale');
const mysql = require('mysql');
const {Signale} = require('signale');
// Overrides any existing `package.json` config
signale.config({
  displayFilename: false,
  displayTimestamp: true,
  displayDate: false
}); 

const options = {
  disabled: false,
  interactive: false,
  stream: process.stdout,
  scope: 'custom',
  types: {
    remind: {
      badge: '**',
      color: 'yellow',
      label: 'reminder'
    },
    santa: {
      badge: '🎅',
      color: 'red',
      label: 'Bamazon Santa'
    }
  }
};

var custom = new Signale(options);
custom.santa('Welcome to Bamazon.');


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
init();
});

//main logic
function init(){
  inquirer
  .prompt([
    {}
  ]);
}