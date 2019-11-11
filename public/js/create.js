let questionCounter = 1;

$("#multipleChoice").on("click", function(event) {
	event.preventDefault();

	$("#questionList").append(`
		<div class="question">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" id="questionTitle"/>
			</div>
			<div class="questionSection">
				<div>
					<input type="radio" name="questionChoice${questionCounter}" value="1" />
					<input type="text"/>
				</div>
				<div>
					<input type="radio" name="questionChoice${questionCounter}" value="2" />
					<input type="text"/>
				</div>
				<div>
					<input type="radio" name="questionChoice${questionCounter}" value="3" />
					<input type="text"/>
				</div>
				<div>
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

$("#multipleAnswer").on("click", function(event) {
	event.preventDefault();

	$("#questionList").append(`
		<div class="question">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" id="questionTitle"/>
			</div>
			<div class="questionSection">
				<div>
					<input type="checkbox" value="1" />
					<input type="text"/>
				</div>
				<div>
					<input type="checkbox" value="2" />
					<input type="text"/>
				</div>
				<div>
					<input type="checkbox" value="3" />
					<input type="text"/>
				</div>
				<div>
					<input type="checkbox" value="4" />
					<input type="text"/>
				</div>
			</div>
			<div class="questionSection">
				<button class="questionDeleteBtn">Delete</button>
			</div>
		</div>`);
});

$("#openEnded").on("click", function(event) {
	event.preventDefault();

	$("#questionList").append(`
		<div class="question">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" id="questionTitle"/>
			</div>
			<div class="questionSection">
				<input type="text" id="questionText"/>
			</div>
			<div class="questionSection">
				<button class="questionDeleteBtn">Delete</button>
			</div>
		</div>`);
});

$("#trueFalse").on("click", function(event) {
	event.preventDefault();

	$("#questionList").append(`
		<div class="question">
			<div class="questionSection">
				<label for="questionTitle">Question:</label>
				<input type="text" name="questionTitle" id="questionTitle"/>
			</div>
			<div class="questionSection">
				<div>
					<input type="radio" name="questionChoice${questionCounter}" value="1" id="true${questionCounter}">
					<label for="true${questionCounter}">True</label>
				</div>
				<div>
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