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

loadHomePage();
