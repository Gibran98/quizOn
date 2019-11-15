const QuestionTypes = {
	MULTIPLE_CHOICE: 1,
	MULTIPLE_ANSWER: 2,
	OPEN_ENDED: 3,
	TRUE_FALSE: 4
}

let user;
function setUp() {
	setUsername();
	setNavMenu();

}

function setUsername() {
	user = JSON.parse(localStorage.getItem('globalUser')) || {username: "Guest"};
	$("#userLabel").text(user.username);
}

function setNavMenu() {
	if(!user.password) {
		$("#loginLink").text("Log-in");
		$("#createLink").hide();
	} else {
		$("#loginLink").text("Log-out");
		$("#createLink").show();
	}

	$(".navLink").on("click", function(event) {
		event.preventDefault();
		console.log($(this).attr('href'));
		window.location = $(this).attr('href');
	})

}

setUp();