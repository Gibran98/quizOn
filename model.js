let mongoose = require('mongoose'); //dependency to connect Node with Mongo
mongoose.Promise = global.Promise; // 

let userSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you pass in an object with the attributes the schema will have
	username : { type : String }, //
	password : { type : String }
});
let User = mongoose.model('User', userSchema);

let quizSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you pass in an object with the attributes the schema will have
	quizQuestions : { type : Array }, //
	quizTags : { type : Array },
	quizTitle : { type : String },
	userName : { type : String },
	user: {type: mongoose.Schema.Types.ObjectId,
			ref: 'User'}
});
let Quiz = mongoose.model('Quiz', quizSchema); //Model is a method to create a collection

let attemptSchema = mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId,
			ref: 'User'},
	grade: {type: Number},
	quizTitle: {type: String},
	quizId: {type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz'},
	userAnswers: {type: Array},
	gradedAnswers: {type: Array},
	date: {type: Date}
})

let Attempt = mongoose.model('Attempt', attemptSchema);

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
	getRecentQuizzesByUser(uId, limit) {
		return Quiz.find({user : uId}).sort({_id:-1}).limit(limit)
			.then(attempts => {
				return attempts;
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
};



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
};

let AttemptList = {
	getAttemptsById: function(aId) {
		return Attempt.findOne({_id : aId})
			.then(attempt => {
				return attempt;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	getRecentAttemptsByUser: function(uId, limit) {
		return Attempt.find({user : uId}).sort({_id:-1}).limit(limit)
			.then(attempts => {
				return attempts;
			})
			.catch(error => {
				throw Error(error);
			})
	},
	post: function(newAttempt) {
		return Attempt.create(newAttempt)
			.then(attempt => {
				return attempt;
			})
			.catch(error => {
				throw Error(error);
			})
	}
};

module.exports = {QuizList, UserList, AttemptList};

