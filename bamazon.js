				/******************************************************************
				*                                                                 *
				*                   BAMAZON UCF 2018 HOMEWORK   	 	  *
				*                           BRYCE LANG  			  *
				*                                                                 *
				*                                                                 *
				******************************************************************/


//IMPORTS NODE MODULES
const signale = require('signale');
const mysql = require('mysql');
const {Signale} = require('signale');
const inquirer = require('inquirer');
const chalk = require ('chalk');

// Overrides any existing `package.json` config
signale.config({
  displayFilename: false,
  displayTimestamp: true,
  displayDate: false
}); 

//custom options for signale package
const options = {
  disabled: false,
  interactive: false,
  stream: process.stdout,
  scope: '',
  types: {
    remind: {
      badge: '**',
      color: 'yellow',
      label: 'INVENTORY'
    },
    santa: {
      badge: '🎅',
      color: 'red',
      label: 'Bamazon Santa'
    }
  }
};

//constructs a new instance of Signale and logs some simple data
var custom = new Signale(options);
custom.santa('Welcome to Bamazon.');
signale.success('packages loaded');

//creates a connection to the database
var database = mysql.createConnection({
  host:"localhost",
  port:'3306',
  user:"root",
  database:"bamazon"
});

//init the connection and returns any errors
database.connect(function(error) {
  if(error) throw error;
signale.success('mysql loaded');
});

function grabInventory() {
//connects to the db and grabs the product table
	query = 'SELECT * FROM products';
	database.query(query, function(error, data) {
		if (error) throw error;
    
    //styling
		custom.remind();
		console.log((chalk.yellow)('...................'));

    //outputs the data pulled from the database
    var output = "";
    //loops through the database and outputs the inventory
		for (var i = 0; i < data.length; i++) {
			output = "\n";
			output += 'ITEM ID: ' + chalk.red(data[i].item_id) + ' ';
			output += 'PRODUCT ' +  chalk.bgRed(data[i].product_name) + ' ';
			output += 'DEPT: ' +  chalk.red(data[i].department_name) + ' ';
      output += 'PRICE: $' + chalk.green (data[i].price) + ' ';
      output += 'STOCK: ' +  chalk.yellow(data[i].stock_quantity);

      //logs the items 
      console.log(output);
    }
    //styling
    console.log((chalk.yellow)("---------------------------------------------------------------------\n"));

      //asks the user what the would like to buy
      init();
	});
}
//calls the function to diaplay the inventory
grabInventory();

//main logic
function init() {
  //inquire what the user would like to purchase
  inquirer
  .prompt([
    {    
    name:"item_id",
    type:"input",
    message:chalk.red("Input the unique ID of the product you would like to purchase:"),

    },
    {
      name:"quantity",
      type:"input",
      message:chalk.green("How many units of the prdouct would you like to purchase?"),
  }
  ]).then(function(data) {

    //initial query to check if we have enough items to sell
    var query = "SELECT product_name,stock_quantity,price FROM products WHERE ?";
    database.query(query, {item_id: data.item_id}, function(error, result) {
        if(error) throw error;
      
        // checks to make sure we have enough inventory to sell you X amount of a product by cross checking 
        // stock quantity vs user input*(data.quantity)
        if(result[0].stock_quantity < data.quantity) {
            console.log(chalk.blue("There are only " + result[0].stock_quantity + " available units of " + result[0].product_name + " in stock."));
        }
        else{
        
        //sets variable price = to number of products purchased multiplied by the price pulled from our DB
        var price = (data.quantity * result[0].price);
        var query = "UPDATE products SET ? WHERE ?";
        
        //drills into our database and sets some variables to call upon later
        var remainder = result[0].stock_quantity - data.quantity;

        //querys the database to update the inventory of the product table
        database.query(query, [{stock_quantity:remainder}, {item_id:data.item_id}]);
        
        //logs what you purchased and for how much $
        custom.santa("you purchased " + chalk.blue(data.quantity) + " units of " + chalk.cyan(result[0].product_name) + " for $" + chalk.green(parseFloat(price)));
        
        //displays the current inventory
        grabInventory();
      }
    });
  });
}
