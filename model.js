let mongoose = require('mongoose'); //dependency to connect Node with Mongo
mongoose.Promise = global.Promise; // 

let quizSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you pass in an object with the attributes the schema will have
	quizQuestions : { type : Array }, //
	quizTags : { type : Array },
	quizTitle : { type : String },
	user : { type : String }
});

let userSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you pass in an object with the attributes the schema will have
	username : { type : String }, //
	password : { type : String }
});

let Quiz = mongoose.model('Quiz', quizSchema); //Model is a method to create a collection
let User = mongoose.model('User', userSchema);

let QuizList = {
	getAll: function(){
		return Quiz.find()
			.then(quizzes => {
				return quizzes;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	getQuizById: function(qId) {
		return Quiz.findOne({_id : qId})
			.then(quiz => {
				return quiz;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	post : function(newQuiz) {
		return Quiz.create(newQuiz)
			.then(quiz => {
				return quiz;
			})
			.catch(error => {
				throw Error(error);
			})
	}
}

let UserList = {
	getUserByName: function(uName) {
		return User.findOne({username : uName})
			.then(user => {
				return user;
			})
			.catch(error => {
				throw Error(error);
			});
	},
	getUserById: function(uId) {
		return User.findOne({_id : uId})
			.then(user => {
				return user;
			})
			.catch(error => {
				throw Error(error);
			});
	},
	post : function(newUser) {
		return User.create(newUser)
			.then(user => {
				return user;
			})
			.catch(error => {
				throw Error(error);
			});
	}
}

module.exports = {QuizList, UserList};

