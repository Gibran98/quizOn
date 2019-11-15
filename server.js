let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let app = express();
let jsonParser = bodyParser.json();
let bcrypt = require("bcrypt");
const {DATABASE_URL, PORT} = require('./config')

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let { QuizList, UserList, AttemptList } = require('./model');

app.use(express.static('public'));
app.use(morgan("dev"));

app.get("/api/getQuizzes", (req, res, next) => {
	QuizList.getAll()
		.then(quizzes => {
			return res.status(200).json(quizzes);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with DB. Try again later.",
				status: 500
			})
		});
});

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

app.get("/api/getQuizById/:id", (req, res, next) => {
	QuizList.getQuizById(req.params.id)
		.then(quiz => {
			return res.status(200).json(quiz);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with DB. Try again later.",
				status: 500
			})
		});
});

app.get("/api/getRecentQuizzesByUser/:id", (req, res, next) => {
	QuizList.getRecentQuizzesByUser(req.params.id, 10) //TODO: INPUT FIELD PARA AJUSTAR LIMIT
		.then(quizzes => {
			return res.status(200).json(quizzes);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with DB. Try again later.",
				status: 500
			})
		});
});

app.get("/api/getUserById/:id", (req, res, next) => {
	UserList.getUserById(req.params.id)
		.then(user => {
			return res.status(200).json(user);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with DB. Try again later.",
				status: 500
			})
		});
});

app.get("/api/getUserByName/:username", (req, res, next) => {
	UserList.getUserByName(req.params.username)
		.then(user => {
			if(!user) {
				res.statusMessage = "Username not found";
				return res.status(404).json({
					message: "Username not found",
					status: 404
				})
			}
			return res.status(200).json(user);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with DB. Try again later.",
				status: 500
			})
		});
});

app.post("/api/login", jsonParser, (req, res, next) => {
	let password = req.body.user.password;
	let userName = req.body.user.username;

	UserList.getUserByName(userName)
		.then(user => {
			if(!user) {
				res.statusMessage = "User not found";
				return res.status(404).json({
					message: "User not found",
					status: 404
				});
			}

			bcrypt.compare(password, user.password, function(error, equal) {
				if(error) {
					res.statusMessage = "Something went wrong with the DB. Try again later.";
					return res.status(500).json({
						message: "Something went wrong with the DB. Try again later.",
						status: 500
					});
				}

				if(equal) {
					return res.status(201).json({
						message: "User logged-in successfully", 
						status: 201, 
						user: user
					});
				} else {
					//return passwords dont match
					res.statusMessage = "Passwords don't match, try again.";
					return res.status(401).json({
						message: "Passwords don't match, try again.",
						status: 401
					});
				}
			}) 
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		});

});

app.post("/api/register", jsonParser, (req, res, next) => {
	let userPassword = req.body.user.password;
	let userName = req.body.user.username;

	bcrypt.hash(userPassword, 10, function(error, hashedPassword) {
		if(error) {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with the DB. Try again later.",
				status: 500
			});
		}

		let newUser = {username:userName, password:hashedPassword};

		UserList.getUserByName(newUser.username)
			.then(user => {
				console.log(user);
				if(!user) {
					UserList.post(newUser)
						.then(newUser => {
							return res.status(201).json({
								message: "User created successfully", 
								status: 201, 
								user : newUser
							});
						})
						.catch(error => {
							res.statusMessage = "Something went wrong with the DB. Try again later.";
							return res.status(500).json({
								message: "Something went wrong with the DB. Try again later.",
								status: 500
							});
						});
				} else {
					return res.status(409).json({
						message: "User already exists, try again", 
						status: 409, 
						user : user
					});
				}
			})
			.catch(error => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).json({
					message: "Something went wrong with the DB. Try again later.",
					status: 500
				});
			});
	});
});

app.get("/api/getRecentAttemptsByUser/:id", (req, res, next) => {
	AttemptList.getRecentAttemptsByUser(req.params.id, 10) //TODO: INPUT FIELD PARA AJUSTAR LIMIT
		.then(attempts => {
			return res.status(200).json(attempts);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with DB. Try again later.";
			return res.status(500).json({
				message: "Something went wrong with DB. Try again later.",
				status: 500
			})
		});
});

app.post("/api/postAttempt", jsonParser, (req, res) => {
	let newAttempt = req.body.attempt;

	AttemptList.post(newAttempt)
		.then(newAttempt => {
			return res.status(201).json({
				message: "Attempt added to the list", 
				status: 201, 
				attempt : newAttempt
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

