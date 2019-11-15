let questionCounterExplore;

function loadMyQuizzes() {
	$.ajax({
		url: "/api/getRecentQuizzesByUser/" + user._id,
		method: "GET",
		dataType: "json",
		success: function(responseJSON){
			for(let quiz of responseJSON) {
			$("#quizList").append(`<li class='quiz'>
											<p><span>Title: </span> ${quiz.quizTitle}</p>
											<p><span>Tags: </span> ${quiz.quizTags.join(', ')}</p>
											<button class='editQuizBtn' id='${quiz._id}'>Edit</button>
									   </li>`);
			}
		},
		error: function(error){
			console.log(error);
		}
	});
}

function loadAttempts() {
	$.ajax({
		url: "/api/getRecentAttemptsByUser/" + user._id,
		method: "GET",
		dataType: "json",
		success: function(responseJSON){
			for(let attempt of responseJSON) {
			$("#attemptList").append(`<li class='attempt'>
											<p><span>Title: </span> ${attempt.quizTitle}</p>
											<p><span>Grade: </span> ${attempt.grade}</p>
											<button class='seeAttemptBtn' id='${attempt._id}'>See Attempt</button>
									   </li>`);
			}
		},
		error: function(error){
			console.log(error);
		}
	});
}

function loadGuestInfo() {
	$("#guestSection").show();
	$("#userSection").hide();
}

function loadUserInfo() {
	$("#guestSection").hide();
	$("#userSection").show();

	loadAttempts();
	loadMyQuizzes();
	
}

function loadHomePage() {
	if(user.password) {
		loadUserInfo();
	} else {
		loadGuestInfo();
	}
}

function addButtonListeners(){
	$("#attemptList").on("click", ".seeAttemptBtn", function(event) {
		event.preventDefault();

		$("#attemptSection").show();	
		$("#userSection").hide();

		let attemptId = event.target.id;

		$.ajax({
			url: "/api/getAttemptById/" + attemptId,
			method: "GET",
			dataType: "json",
			success: function(responseJSON){
				getQuizFromAttempt(responseJSON);
			},
			error: function(error){
				console.log(error);
			}
		});
	});

	$("#attemptSection").on("click", "#returnToListBtn", function(event) {
		event.preventDefault();
		$("#attemptSection").hide();
		$("#attemptSection").empty();
		$("#userSection").show();
	});
}

function getQuizFromAttempt(attempt){
	$.ajax({
			url: "/api/getQuizById/" + attempt.quizId,
			method: "GET",
			dataType: "json",
			success: function(responseJSON){
				loadAttempt(attempt, responseJSON);
			},
			error: function(error){
				console.log(error);
			}
		});
}

function loadAttempt(attempt, quiz){
	questionCounterExplore = 1;

	$("#attemptSection").append(`<h2>${quiz.quizTitle}</h2>`);
	for(let question of quiz.quizQuestions) {
		if(question.questionType == QuestionTypes.MULTIPLE_CHOICE) {
			addMultipleChoiceQuestion(question, attempt.userAnswers[questionCounterExplore-1], attempt.gradedAnswers[questionCounterExplore-1]);
		}
		else if(question.questionType == QuestionTypes.MULTIPLE_ANSWER) {
			addMultipleAnswerQuestion(question, attempt.userAnswers[questionCounterExplore-1], attempt.gradedAnswers[questionCounterExplore-1]);
		}
		else if(question.questionType == QuestionTypes.OPEN_ENDED) {
			addOpenEndedQuestion(question, attempt.userAnswers[questionCounterExplore-1], attempt.gradedAnswers[questionCounterExplore-1]);
		}
		else if(question.questionType == QuestionTypes.TRUE_FALSE) {
			addTrueFalseQuestion(question, attempt.userAnswers[questionCounterExplore-1], attempt.gradedAnswers[questionCounterExplore-1]);
		}
	}
	$("#attemptSection").append(`<button id='returnToListBtn'>Return!</button>`);
}

function addMultipleChoiceQuestion(question, answer, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question multipleChoice ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input disabled type="radio" id="${questionCounterExplore}_1" name="questionChoice${questionCounterExplore}" value="1" />
					<label>${question.choiceTexts[0]}</label>
				</div>
				<div class="choice">
					<input disabled type="radio" id="${questionCounterExplore}_2" name="questionChoice${questionCounterExplore}" value="2" />
					<label>${question.choiceTexts[1]}</label>
				</div>
				<div class="choice">
					<input disabled type="radio" id="${questionCounterExplore}_3" name="questionChoice${questionCounterExplore}" value="3" />
					<label>${question.choiceTexts[2]}</label>
				</div>
				<div class="choice">
					<input disabled type="radio" id="${questionCounterExplore}_4" name="questionChoice${questionCounterExplore}" value="4" />
					<label>${question.choiceTexts[3]}</label>
				</div>
			</div>
		</div>
		`);

	$(`#${questionCounterExplore}_${answer}`).prop('checked', true);
	questionCounterExplore++;
}

function addMultipleAnswerQuestion(question, answers, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question multipleAnswer ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input disabled type="checkbox" id="${questionCounterExplore}_1" value="1" />
					<label>${question.choiceTexts[0]}</label>
				</div>
				<div class="choice">
					<input disabled type="checkbox" id="${questionCounterExplore}_2" value="2" />
					<label>${question.choiceTexts[1]}</label>
				</div>
				<div class="choice">
					<input disabled type="checkbox" id="${questionCounterExplore}_3" value="3" />
					<label>${question.choiceTexts[2]}</label>
				</div>
				<div class="choice">
					<input disabled type="checkbox" id="${questionCounterExplore}_4" value="4" />
					<label>${question.choiceTexts[3]}</label>
				</div>
			</div>
		</div>
		`);

	answers.foreach(answer => $(`#${questionCounterExplore}_${answer}`).prop('checked', true));
	questionCounterExplore++;
}

function addOpenEndedQuestion(question, answer, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question openEnded ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<input disabled type="text" val="${answer}" class="questionText"/>
			</div>
		</div>
		`);
	questionCounterExplore++;
}

function addTrueFalseQuestion(question, answer, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question trueFalse ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterExplore}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input disabled type="radio" name="questionChoice${questionCounterExplore}" value="1" id="true${questionCounterExplore}">
					<label for="true${questionCounterExplore}">True</label>
				</div>
				<div class="choice">
					<input disabled type="radio" name="questionChoice${questionCounterExplore}" value="2" id="false${questionCounterExplore}"/>
					<label for="false${questionCounterExplore}">False</label>
				</div>
			</div>
		</div>
		`);

	$(`#${answer}${questionCounterExplore}`).prop('checked', true);
	questionCounterExplore++;
}


loadHomePage();
addButtonListeners();
