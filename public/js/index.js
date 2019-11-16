let questionCounterIndex;

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
	$("#editQuizSection").hide();
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

	$("#quizList").on("click", ".editQuizBtn", function(event) {
		event.preventDefault();

		let quizId = event.target.id;

		$.ajax({
			url: "/api/getQuizById/" + quizId,
			method: "GET",
			dataType: "json",
			success: function(responseJSON){
				loadQuizEditor(responseJSON);
			},
			error: function(error){
				console.log("Error");
			}
		});
	});

	$("#editQuizSection").on("click", ".cancelEditBtn", function(event) {
		event.preventDefault();

		$("#quizEditList").empty();
		$(".cancelEditBtn").remove();
		$(".submitQuizBtn").remove();
		$("#editQuizSection").hide();
		$("#userSection").show();
	});

	$("#editQuizSection").on("click", ".submitQuizBtn", function(event) {
		event.preventDefault();

		let quizId = event.target.id;

		let quizTitle = $("#quizTitle").val();
		let quizTags = $("#quizTags").val().split(",").map(x => x.trim());
		let quizQuestions = [];

		let questions = $(".question");
		for (let question of questions) {
			if($(question).hasClass("multipleChoice")) 
				quizQuestions.push(parseMultipleChoice(question));

			else if($(question).hasClass("multipleAnswer")) 
				quizQuestions.push(parseMultipleAnswer(question));

			else if($(question).hasClass("openEnded"))
				quizQuestions.push(parseOpenEnded(question));

			else if($(question).hasClass("trueFalse"))
				quizQuestions.push(parseTrueFalse(question));
		}

		let quiz = {
			_id: quizId,
			user: user._id,
			quizQuestions,
			quizTags,
			quizTitle,
			userName: user.username,
		}
		
		$.ajax({
				url: "/api/updateQuiz/",
				data: JSON.stringify({quiz: quiz}),
				method: "PUT",
				dataType: "json",
				contentType: "application/json",
				success: function(responseJSON){
					console.log("Successfully updated quiz");
				},
				error: function(error){
					console.log(error);
				}
			});
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
	questionCounterIndex = 1;

	$("#attemptSection").append(`<h2>${quiz.quizTitle}</h2>`);
	for(let question of quiz.quizQuestions) {
		if(question.questionType == QuestionTypes.MULTIPLE_CHOICE) {
			showMultipleChoiceQuestion(question, attempt.userAnswers[questionCounterIndex-1], attempt.gradedAnswers[questionCounterIndex-1]);
		}
		else if(question.questionType == QuestionTypes.MULTIPLE_ANSWER) {
			showMultipleAnswerQuestion(question, attempt.userAnswers[questionCounterIndex-1], attempt.gradedAnswers[questionCounterIndex-1]);
		}
		else if(question.questionType == QuestionTypes.OPEN_ENDED) {
			showOpenEndedQuestion(question, attempt.userAnswers[questionCounterIndex-1], attempt.gradedAnswers[questionCounterIndex-1]);
		}
		else if(question.questionType == QuestionTypes.TRUE_FALSE) {
			showTrueFalseQuestion(question, attempt.userAnswers[questionCounterIndex-1], attempt.gradedAnswers[questionCounterIndex-1]);
		}
	}
	$("#attemptSection").append(`<button id='returnToListBtn'>Return!</button>`);
}

function showMultipleChoiceQuestion(question, answer, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question multipleChoice ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterIndex}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input disabled type="radio" id="mc_${questionCounterIndex}_1" name="questionChoice${questionCounterIndex}" value="1" />
					<label>${question.choiceTexts[0]}</label>
				</div>
				<div class="choice">
					<input disabled type="radio" id="mc_${questionCounterIndex}_2" name="questionChoice${questionCounterIndex}" value="2" />
					<label>${question.choiceTexts[1]}</label>
				</div>
				<div class="choice">
					<input disabled type="radio" id="mc_${questionCounterIndex}_3" name="questionChoice${questionCounterIndex}" value="3" />
					<label>${question.choiceTexts[2]}</label>
				</div>
				<div class="choice">
					<input disabled type="radio" id="mc_${questionCounterIndex}_4" name="questionChoice${questionCounterIndex}" value="4" />
					<label>${question.choiceTexts[3]}</label>
				</div>
			</div>
		</div>
		`);

	$(`#mc_${questionCounterIndex}_${answer}`).prop('checked', true);
	questionCounterIndex++;
}

function showMultipleAnswerQuestion(question, answers, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question multipleAnswer ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterIndex}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input disabled type="checkbox" id="ma_${questionCounterIndex}_1" value="1" />
					<label>${question.choiceTexts[0]}</label>
				</div>
				<div class="choice">
					<input disabled type="checkbox" id="ma_${questionCounterIndex}_2" value="2" />
					<label>${question.choiceTexts[1]}</label>
				</div>
				<div class="choice">
					<input disabled type="checkbox" id="ma_${questionCounterIndex}_3" value="3" />
					<label>${question.choiceTexts[2]}</label>
				</div>
				<div class="choice">
					<input disabled type="checkbox" id="ma_${questionCounterIndex}_4" value="4" />
					<label>${question.choiceTexts[3]}</label>
				</div>
			</div>
		</div>
		`);

	answers.forEach(answer => $(`#ma_${questionCounterIndex}_${answer}`).prop('checked', true));
	questionCounterIndex++;
}

function showOpenEndedQuestion(question, answer, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question openEnded ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterIndex}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<input disabled type="text" value="${answer}" class="questionText"/>
			</div>
		</div>
		`);
	questionCounterIndex++;
}

function showTrueFalseQuestion(question, answer, correct) {
	let correctClass = correct ? "correct" : "incorrect";

	$("#attemptSection").append(`
		<div class="question trueFalse ${correctClass}">
			<div class="questionSection">
				<label>${questionCounterIndex}. ${question.questionTitle}</label>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input disabled type="radio" name="questionChoice${questionCounterIndex}" value="1" id="true${questionCounterIndex}">
					<label for="true${questionCounterIndex}">True</label>
				</div>
				<div class="choice">
					<input disabled type="radio" name="questionChoice${questionCounterIndex}" value="2" id="false${questionCounterIndex}"/>
					<label for="false${questionCounterIndex}">False</label>
				</div>
			</div>
		</div>
		`);

	$(`#${answer}${questionCounterIndex}`).prop('checked', true);
	questionCounterIndex++;
}

function loadQuizEditor(quiz){
	questionCounterIndex = 1;

	$("#userSection").hide();
	$("#editQuizSection").show();

	$("#quizTitle").val(quiz.quizTitle);
	$("#quizTags").val(quiz.quizTags.join(', '));

	for(let question of quiz.quizQuestions) {
		if(question.questionType == QuestionTypes.MULTIPLE_CHOICE) {
			addMultipleChoiceEditable(question);
		}
		else if(question.questionType == QuestionTypes.MULTIPLE_ANSWER) {
			addMultipleAnswerEditable(question);
		}
		else if(question.questionType == QuestionTypes.OPEN_ENDED) {
			addOpenEndedEditable(question);
		}
		else if(question.questionType == QuestionTypes.TRUE_FALSE) {
			addTrueFalseEditable(question);
		}
	}
	$("#editQuizSection").append(`<button class='submitQuizBtn' id='${quiz._id}'>Save changes!</button>`);
	$("#editQuizSection").append(`<button class='cancelEditBtn'>Cancel!</button>`);
}

function addMultipleChoiceEditable(question) {
	event.preventDefault();

	$("#quizEditList").append(`
		<div class="question multipleChoice">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" class="questionTitle" value="${question.questionTitle}"/>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input type="radio" id="mc_${questionCounterIndex}_1" name="questionChoice${questionCounterIndex}" value="1" />
					<input type="text" value="${question.choiceTexts[0]}"/>
				</div>
				<div class="choice">
					<input type="radio" id="mc_${questionCounterIndex}_2" name="questionChoice${questionCounterIndex}" value="2" />
					<input type="text" value="${question.choiceTexts[1]}"/>
				</div>
				<div class="choice">
					<input type="radio" id="mc_${questionCounterIndex}_3" name="questionChoice${questionCounterIndex}" value="3" />
					<input type="text" value="${question.choiceTexts[2]}"/>
				</div>
				<div class="choice">
					<input type="radio" id="mc_${questionCounterIndex}_4" name="questionChoice${questionCounterIndex}" value="4" />
					<input type="text" value="${question.choiceTexts[3]}"/>
				</div>
			</div>
			<div class="questionSection">
				<button class="questionDeleteBtn">Delete</button>
			</div>
		</div>`);
	$(`#mc_${questionCounterIndex}_${question.correctAns}`).prop('checked', true);
	questionCounterIndex++;
}

function addMultipleAnswerEditable(question) {
	event.preventDefault();

	$("#quizEditList").append(`
		<div class="question multipleAnswer">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" class="questionTitle" value="${question.questionTitle}"/>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input type="checkbox" id="ma_${questionCounterIndex}_1" name="questionChoice${questionCounterIndex}" value="1" />
					<input type="text" value="${question.choiceTexts[0]}"/>
				</div>
				<div class="choice">
					<input type="checkbox" id="ma_${questionCounterIndex}_2" name="questionChoice${questionCounterIndex}" value="2" />
					<input type="text" value="${question.choiceTexts[1]}"/>
				</div>
				<div class="choice">
					<input type="checkbox" id="ma_${questionCounterIndex}_3" name="questionChoice${questionCounterIndex}" value="3" />
					<input type="text" value="${question.choiceTexts[2]}"/>
				</div>
				<div class="choice">
					<input type="checkbox" id="ma_${questionCounterIndex}_4" name="questionChoice${questionCounterIndex}" value="4" />
					<input type="text" value="${question.choiceTexts[3]}"/>
				</div>
			</div>
			<div class="questionSection">
				<button class="questionDeleteBtn">Delete</button>
			</div>
		</div>`);
	question.correctAns.forEach(answer => $(`#ma_${questionCounterIndex}_${answer}`).prop('checked', true));
	questionCounterIndex++;
}

function addOpenEndedEditable(question) {
	event.preventDefault();

	$("#quizEditList").append(`
		<div class="question openEnded">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" class="questionTitle" value="${question.questionTitle}"/>
			</div>
			<div class="questionSection">
				<input type="text" class="questionText" value="${question.correctAns}"/>
			</div>
			<div class="questionSection">
				<button class="questionDeleteBtn">Delete</button>
			</div>
		</div>`);

	questionCounterIndex++;
}

function addTrueFalseEditable(question) {
	event.preventDefault();

	$("#quizEditList").append(`
		<div class="question trueFalse">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" class="questionTitle" value="${question.questionTitle}"/>
			</div>
			<div class="questionSection">
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterIndex}" value="1" id="true${questionCounterIndex}">
					<label for="true${questionCounterIndex}">True</label>
				</div>
				<div class="choice">
					<input type="radio" name="questionChoice${questionCounterIndex}" value="2" id="false${questionCounterIndex}"/>
					<label for="false${questionCounterIndex}">False</label>
				</div>
			</div>
			<div class="questionSection">
				<button class="questionDeleteBtn">Delete</button>
			</div>
		</div>`);

	$(`#${question.correctAns}${questionCounterIndex}`).prop('checked', true);
	questionCounterIndex++;
}

function addQuestionListeners() {
	$("#multipleChoiceBtn").on("click", function(event) {
		event.preventDefault();

		$("#quizEditList").append(`
			<div class="question multipleChoice">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle"/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterIndex}" value="1" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterIndex}" value="2" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterIndex}" value="3" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterIndex}" value="4" />
						<input type="text"/>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn">Delete</button>
				</div>
			</div>`);
		questionCounterIndex++;

		let firstRadio = $("#quizEditList").children().last().children().eq(1).children().eq(0).children().eq(0);
		$(firstRadio).prop("checked", true);
		//console.log($("#quizEditList").children().last().eq(1).eq(0).eq(0));
	});

	$("#multipleAnswerBtn").on("click", function(event) {
		event.preventDefault();

		$("#quizEditList").append(`
			<div class="question multipleAnswer">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle"/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="checkbox" value="1" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="checkbox" value="2" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="checkbox" value="3" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="checkbox" value="4" />
						<input type="text"/>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn">Delete</button>
				</div>
			</div>`);
	});

	$("#openEndedBtn").on("click", function(event) {
		event.preventDefault();

		$("#quizEditList").append(`
			<div class="question openEnded">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle"/>
				</div>
				<div class="questionSection">
					<input type="text" class="questionText"/>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn">Delete</button>
				</div>
			</div>`);
	});

	$("#trueFalseBtn").on("click", function(event) {
		event.preventDefault();

		$("#quizEditList").append(`
			<div class="question trueFalse">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle"/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterIndex}" value="1" id="true${questionCounterIndex}">
						<label for="true${questionCounterIndex}">True</label>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterIndex}" value="2" id="false${questionCounterIndex}"/>
						<label for="false${questionCounterIndex}">False</label>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn">Delete</button>
				</div>
			</div>`);
		questionCounterIndex++;

		let firstRadio = $("#quizEditList").children().last().children().eq(1).children().eq(0).children().eq(0);
		$(firstRadio).prop("checked", true);
	});
}

function parseMultipleChoice(question) {
	let questionTitle = $($(question).find(".questionTitle")[0]).val();
	let choices = $(question).find(".choice");
	let choiceTexts = [];
	let correctAns;

	for (let choice of choices) {
		choiceTexts.push($(choice).children().eq(1).val());
		let radioBtn = $(choice).children().eq(0);
		if ($(radioBtn).is(":checked")){
			correctAns = $(radioBtn).val();
		}
	}
	
	return {
		questionTitle,
		choiceTexts,
		correctAns,
		questionType: QuestionTypes.MULTIPLE_CHOICE
	}
}

function parseMultipleAnswer(question) {
	let questionTitle = $($(question).find(".questionTitle")[0]).val();
	let choices = $(question).find(".choice");
	let choiceTexts = [];
	let correctAns = [];

	for (let choice of choices) {
		choiceTexts.push($(choice).children().eq(1).val());
		let radioBtn = $(choice).children().eq(0);
		if ($(radioBtn).is(":checked")){
			correctAns.push($(radioBtn).val());
		}
	}
	
	return {
		questionTitle,
		choiceTexts,
		correctAns,
		questionType: QuestionTypes.MULTIPLE_ANSWER
	}
}

function parseOpenEnded(question) {
	let questionTitle = $($(question).find(".questionTitle")[0]).val();
	let correctAns = $($(question).find(".questionText")[0]).val().toLowerCase();
	return {
		questionTitle,
		correctAns,
		questionType: QuestionTypes.OPEN_ENDED
	}
}

function parseTrueFalse(question) {
	let questionTitle = $($(question).find(".questionTitle")[0]).val();
	let choice = $(question).find(".choice")[0];
	let radioBtn = $(choice).children().eq(0);
	let correctAns = $(radioBtn).is(":checked");
	
	return {
		questionTitle,
		correctAns,
		questionType: QuestionTypes.TRUE_FALSE
	}
}


loadHomePage();
addButtonListeners();
addQuestionListeners();
