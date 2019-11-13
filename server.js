let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let app = express();
let jsonParser = bodyParser.json();

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(morgan("dev"));

function runServer(port, databaseUrl) { //function to run when the server starts
	return new Promise((resolve, reject) => {
		mongoose.connect( databaseUrl, error => { //the 'error' parameter is only going to be holding
			if(error){							  //something when an error is triggered
				return reject(error);
			}

			server = app.listen(port, ()=> {
				console.log("Something is going on on port " + port);
				resolve();
			})
		})
	})
}

runServer(8080, "mongodb://localhost/QuizOnDB")
	.catch(error => {
		console.log(error);
	});

