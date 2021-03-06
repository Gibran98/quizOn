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
	$("#userLabel").text(sanitize(user.username));
}

function setNavMenu() {
	if(!user.password) {
		$("#loginLink").text("Log-in");
		$("#createLink").hide();
		$(".navLink").css("width", "33.3333%")


	} else {
		$("#loginLink").text("Log-out");
		$("#createLink").show();
		$(".navLink").css("width", "25%");
	}

	$(".navLink").on("click", function(event) {
		event.preventDefault();
		console.log($(this).attr('href'));
		window.location = $(this).attr('href');
	})

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
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

setUp();