let questionCounter = 1;

$("#saveQuizBtn").on("click", function(event) {
	event.preventDefault();

	let quizTitle = $("#quizTitle").val();
	let quizTags = $("#quizTags").val().split(",");
	let quizQuestions = [];

	let questions = $(".question");
	for (let question of questions) {
		//TODO: THEY SHOULD GO TO DB
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
		quizQuestions,
		quizTags,
		quizTitle,
		user
	}
	console.log(quiz);
});

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
	let questionText = $($(question).find(".questionText")[0]).val();
	return {
		questionTitle,
		questionText,
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

function addButtonListeners() {
	$("#multipleChoiceBtn").on("click", function(event) {
		event.preventDefault();

		$("#questionList").append(`
			<div class="question multipleChoice">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle"/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounter}" value="1" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounter}" value="2" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounter}" value="3" />
						<input type="text"/>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounter}" value="4" />
						<input type="text"/>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn">Delete</button>
				</div>
			</div>`);
		questionCounter++;

		let firstRadio = $("#questionList").children().last().children().eq(1).children().eq(0).children().eq(0);
		$(firstRadio).prop("checked", true);
		//console.log($("#questionList").children().last().eq(1).eq(0).eq(0));
	});

	$("#multipleAnswerBtn").on("click", function(event) {
		event.preventDefault();

		$("#questionList").append(`
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

		$("#questionList").append(`
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

		$("#questionList").append(`
			<div class="question trueFalse">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle"/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounter}" value="1" id="true${questionCounter}">
						<label for="true${questionCounter}">True</label>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounter}" value="2" id="false${questionCounter}"/>
						<label for="false${questionCounter}">False</label>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn">Delete</button>
				</div>
			</div>`);
		questionCounter++;

		let firstRadio = $("#questionList").children().last().children().eq(1).children().eq(0).children().eq(0);
		$(firstRadio).prop("checked", true);
	});

	$("#questionList").on("click", ".questionDeleteBtn", function(event) {
		event.preventDefault();

		$(this).parent().parent().remove();
	});
}

addButtonListeners();