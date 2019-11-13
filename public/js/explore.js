function loadQuizzes(){
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
									   </li>`);

			}
		},
		error: function(error){
			console.log("Error");
		}
	});
}

loadQuizzes();