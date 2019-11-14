let questionCounterExplore = 0;

$("#quizList").on("click", ".takeQuizBtn", function(event) {
	event.preventDefault();

	let quizId = event.target.id;
	$.ajax({
		url: "/api/getQuizById/" + quizId,
		method: "GET",
		dataType: "json",
		success: function(responseJSON){
			loadQuiz(responseJSON);
		},
		error: function(error){
			console.log("Error");
		}
	});
});

$("#takeQuizSection").on("click", ".submitQuizBtn", function(event) {
	event.preventDefault();

	let quizId = event.target.id;
	$.ajax({
		url: "/api/getQuizById/" + quizId,
		method: "GET",
		dataType: "json",
		success: function(responseJSON){
			gradeQuiz(responseJSON);
		},
		error: function(error){
			console.log("Error");
		}
	});
});


function loadAllQuizzes(){
	$.ajax({
		url: "/api/getQuizzes",
		method: "GET",
		dataType: "json",
		success: function(responseJSON){
			$("#quizList").empty();

			for (let quiz of responseJSON){
				$("#quizList").append(`<li class=quiz>
											<p><span>Title: </span> ${quiz.quizTitle}</p>
											<p><span>Author: </span> ${quiz.user}</p>
											<button class='takeQuizBtn' id='${quiz._id}'>Take quiz!</button>
									   </li>`);

			}
		},
		error: function(error){
			console.log("Error");
		}
	});
}

function loadQuiz(quiz) {
	questionCounterExplore = 1;
	$("#quizListSection").hide();

	$("#takeQuizSection").append(`<h2>${quiz.quizTitle}</h2>`);
	for(let question of quiz.quizQuestions) {
		if(question.questionType == QuestionTypes.MULTIPLE_CHOICE) {
			addMultipleChoiceQuestion(question);
		}
		else if(question.questionType == QuestionTypes.MULTIPLE_ANSWER) {
			addMultipleAnswerQuestion(question);
		}
		else if(question.questionType == QuestionTypes.OPEN_ENDED) {
			addOpenEndedQuestion(question);
		}
		else if(question.questionType == QuestionTypes.TRUE_FALSE) {
			addTrueFalseQuestion(question);
		}
	}
	$("#takeQuizSection").append(`<button class='submitQuizBtn' id='${quiz._id}'>Submit!</button>`);
}

function addMultipleChoiceQuestion(question) {
	$("#takeQuizSection").append(`
		<div class="question multipleChoice">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterExplore}" value="1" />
					<label>${question.choiceTexts[0]}</label>
				</div>
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterExplore}" value="2" />
					<label>${question.choiceTexts[1]}</label>
				</div>
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterExplore}" value="3" />
					<label>${question.choiceTexts[2]}</label>
				</div>
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterExplore}" value="4" />
					<label>${question.choiceTexts[3]}</label>
				</div>
			</div>
		</div>
		`);
	questionCounterExplore++;
}

function addMultipleAnswerQuestion(question) {
	$("#takeQuizSection").append(`
		<div class="question multipleAnswer">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input type="checkbox" value="1" />
					<label>${question.choiceTexts[0]}</label>
				</div>
				<div class="choice">
					<input type="checkbox" value="2" />
					<label>${question.choiceTexts[1]}</label>
				</div>
				<div class="choice">
					<input type="checkbox" value="3" />
					<label>${question.choiceTexts[2]}</label>
				</div>
				<div class="choice">
					<input type="checkbox" value="4" />
					<label>${question.choiceTexts[3]}</label>
				</div>
			</div>
		</div>
		`);
	questionCounterExplore++;
}

function addOpenEndedQuestion(question) {
	$("#takeQuizSection").append(`
		<div class="question openEnded">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<input type="text" class="questionText"/>
			</div>
		</div>
		`);
	questionCounterExplore++;
}

function addTrueFalseQuestion(question) {
	$("#takeQuizSection").append(`
		<div class="question trueFalse">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterExplore}" value="1" id="true${questionCounterExplore}">
					<label for="true${questionCounterExplore}">True</label>
				</div>
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterExplore}" value="2" id="false${questionCounterExplore}"/>
					<label for="false${questionCounterExplore}">False</label>
				</div>
			</div>
		</div>
		`);
	questionCounterExplore++;
}

function parseMultipleChoice(question) {
	let choices = $(question).find(".choice");
	console.log(choices);
	for (let choice of choices) {
		let radioBtn = $(choice).children().eq(0);
		if ($(radioBtn).is(":checked")){
			return $(radioBtn).val();
		}
	}
}

function parseMultipleAnswer(question) {
	let choices = $(question).find(".choice");
	let correctAns = [];

	for (let choice of choices) {
		let radioBtn = $(choice).children().eq(0);
		if ($(radioBtn).is(":checked")){
			correctAns.push($(radioBtn).val());
		}
	}
	
	return correctAns;
}

function parseOpenEnded(question) {
	return $($(question).find(".questionText")[0]).val().toLowerCase();
}

function parseTrueFalse(question) {
	let choice = $(question).find(".choice")[0];
	let radioBtn = $(choice).children().eq(0);
	return $(radioBtn).is(":checked");
}

function gradeQuiz(quiz) {
	let correctAnswers = quiz.quizQuestions.map(q => q.correctAns);
	let userAnswers = [];
	let gradedAnswers = [];

	let questions = $(".question");
	for (let question of questions) {
		if($(question).hasClass("multipleChoice"))  {
			userAnswers.push(parseMultipleChoice(question));
		}
		else if($(question).hasClass("multipleAnswer")) {
			userAnswers.push(parseMultipleAnswer(question));
		}
		else if($(question).hasClass("openEnded")) {
			userAnswers.push(parseOpenEnded(question));
		}
		else if($(question).hasClass("trueFalse")) {
			userAnswers.push(parseTrueFalse(question));
		}
	}
	
	for(let i=0; i<userAnswers.length; i++) 
		gradedAnswers.push(JSON.stringify(correctAnswers[i]) == JSON.stringify(userAnswers[i]));

	showQuizResults(gradedAnswers);
}

function showQuizResults(gradedAnswers) {
	let questions = $(".question");
	let correctCounter = 0;

	for(let i=0; i<gradedAnswers.length; i++) {
		if(gradedAnswers[i]) {
			$(questions[i]).addClass("correct");
			$(questions[i]).removeClass("incorrect");
			correctCounter++;
		} else {
			$(questions[i]).addClass("incorrect");
			$(questions[i]).removeClass("correct");
		}
	}

	$("#takeQuizSection").append(`
		<label>Results: ${correctCounter}/${gradedAnswers.length} (${(correctCounter/gradedAnswers.length*100).toFixed(2)}%)</label>
		`);

}

loadAllQuizzes();