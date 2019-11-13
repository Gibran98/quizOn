let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let app = express();
let jsonParser = bodyParser.json();
const {DATABASE_URL, PORT} = require('./config')

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let { QuizList } = require('./model');

app.use(express.static('public'));
app.use(morgan("dev"));

app.post("/api/postQuiz", jsonParser, (req, res) => {

	let newQuiz = req.body.quiz;

	QuizList.post(newQuiz)
		.then(newQuiz => {
			return res.status(201).json({
				message: "Quiz added to the list", 
				status: 201, 
				quiz : newQuiz
			});
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		});
});

let server;
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

function closeServer(){
	 return mongoose.disconnect()
	 .then(() => {
	 	return new Promise((resolve, reject) => {
	 		console.log('Closing the server');
			server.close( err => {
				 if (err){
				 	return reject(err);
				 }
				 else{
				 	resolve();
				 }
			 });
	 	});
	 });
}

runServer(PORT, DATABASE_URL)
	.catch(error => {
		console.log(error);
	});

module.exports = {app, runServer, closeServer};

