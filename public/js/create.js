let questionCounterCreate = 1;

function parseMultipleChoice(question) {
	let questionTitle = sanitize($($(question).find(".questionTitle")[0]).val());
	let choices = $(question).find(".choice");
	let choiceTexts = [];
	let correctAns;

	for (let choice of choices) {
		choiceTexts.push(sanitize($(choice).children().eq(1).val()));
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
	let questionTitle = sanitize($($(question).find(".questionTitle")[0]).val());
	let choices = $(question).find(".choice");
	let choiceTexts = [];
	let correctAns = [];

	for (let choice of choices) {
		choiceTexts.push(sanitize($(choice).children().eq(1).val()));
		let radioBtn = $(choice).children().eq(0);
		if ($(radioBtn).is(":checked")){
			correctAns.push(sanitize($(radioBtn).val()));
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
	let questionTitle = sanitize($($(question).find(".questionTitle")[0]).val());
	let correctAns = sanitize($($(question).find(".questionText")[0]).val().toLowerCase());
	return {
		questionTitle,
		correctAns,
		questionType: QuestionTypes.OPEN_ENDED
	}
}

function parseTrueFalse(question) {
	let questionTitle = sanitize($($(question).find(".questionTitle")[0]).val());
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
	$("#saveQuizBtn").on("click", function(event) {
		event.preventDefault();

		let quizTitle = sanitize($("#quizTitle").val());
		let quizTags = $("#quizTags").val().split(",").map(x => sanitize(x.trim().toLowerCase()));
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
			user: user._id,
			quizQuestions,
			quizTags,
			quizTitle,
			userName: user.username,
		}
		
		$.ajax({
				url: "/api/postQuiz",
				data: JSON.stringify({quiz: quiz}),
				method: "POST",
				dataType: "json",
				contentType: "application/json",
				success: function(responseJSON){
					window.location = "/index.html";
				},
				error: function(error){
					console.log("Error: " + error);
				}
			});
	});

	$("#multipleChoiceBtn").on("click", function(event) {
		event.preventDefault();

		$("#questionList").append(`
			<div class="question multipleChoice">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle" placeholder="Type the question title..."/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="radio" class="browser-default" name="questionChoice${questionCounterCreate}" value="1" />
						<input type="text" class="browser-default choiceText" placeholder="Option 1"/>
					</div>
					<div class="choice">
						<input type="radio" class="browser-default" name="questionChoice${questionCounterCreate}" value="2" />
						<input type="text" class="browser-default choiceText" placeholder="Option 2"/>
					</div>
					<div class="choice">
						<input type="radio" class="browser-default" name="questionChoice${questionCounterCreate}" value="3" />
						<input type="text" class="browser-default choiceText" placeholder="Option 3"/>
					</div>
					<div class="choice">
						<input type="radio" class="browser-default" name="questionChoice${questionCounterCreate}" value="4" />
						<input type="text" class="browser-default choiceText" placeholder="Option 4"/>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn waves-effect waves-light btn redBtn">Delete</button>
				</div>
			</div>`);
		questionCounterCreate++;

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
					<input type="text" name="questionTitle" class="questionTitle" placeholder="Type the question title..."/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="checkbox" value="1" />
						<input type="text" class="browser-default choiceText" placeholder="Option 1"/>
					</div>
					<div class="choice">
						<input type="checkbox" value="2" />
						<input type="text" class="browser-default choiceText" placeholder="Option 2"/>
					</div>
					<div class="choice">
						<input type="checkbox" value="3" />
						<input type="text" class="browser-default choiceText" placeholder="Option 3"/>
					</div>
					<div class="choice">
						<input type="checkbox" value="4" />
						<input type="text" class="browser-default choiceText" placeholder="Option 4"/>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn waves-effect waves-light btn redBtn">Delete</button>
				</div>
			</div>`);
	});

	$("#openEndedBtn").on("click", function(event) {
		event.preventDefault();

		$("#questionList").append(`
			<div class="question openEnded">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle" placeholder="Type the question title..."/>
				</div>
				<div class="questionSection">
					<input type="text" class="questionText browser-default choiceText" placeholder="Type answer here..."/>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn waves-effect waves-light btn redBtn">Delete</button>
				</div>
			</div>`);
	});

	$("#trueFalseBtn").on("click", function(event) {
		event.preventDefault();

		$("#questionList").append(`
			<div class="question trueFalse">
				<div class="questionSection">
					<label for="questionTitle">Question:</label>
					<input type="text" name="questionTitle" class="questionTitle" placeholder="Type the question title..."/>
				</div>
				<div class="questionSection">
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterCreate}" value="1" id="true${questionCounterCreate}">
						<label for="true${questionCounterCreate}">True</label>
					</div>
					<div class="choice">
						<input type="radio" name="questionChoice${questionCounterCreate}" value="2" id="false${questionCounterCreate}"/>
						<label for="false${questionCounterCreate}">False</label>
					</div>
				</div>
				<div class="questionSection">
					<button class="questionDeleteBtn waves-effect waves-light btn redBtn">Delete</button>
				</div>
			</div>`);
		questionCounterCreate++;

		let firstRadio = $("#questionList").children().last().children().eq(1).children().eq(0).children().eq(0);
		$(firstRadio).prop("checked", true);
	});

	$("#questionList").on("click", ".questionDeleteBtn", function(event) {
		event.preventDefault();

		$(this).parent().parent().remove();
	});
}

function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
      '`': '&grave;'
  };
  const reg = /[&<>"'`/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

addButtonListeners();
$("#quizUserName").text("By " + JSON.parse(localStorage.getItem('globalUser')).username);
