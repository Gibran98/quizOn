let mongoose = require('mongoose'); //dependency to connect Node with Mongo
mongoose.Promise = global.Promise; // 

let quizSchema = mongoose.Schema({ //Schema is a meethod to build a schema, you pass in an object with the attributes the schema will have
	quizQuestions : { type : Array }, //
	quizTags : { type : Array },
	quizTitle : { type : String },
	user : { type : String }
});

let Quiz = mongoose.model('Quiz', quizSchema); //Model is a method to create a collection

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

module.exports = {QuizList};

