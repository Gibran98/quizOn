$("#registerForm").on("submit", function(event) {
	event.preventDefault();

	let username = $("#userNameInputReg").val();
	let password = $("#passwordInputReg").val();
	let passwordConfirm = $("#passwordConfirmInputReg").val();

	if(username=="" || password=="" || passwordConfirm=="") 
		$("#registerError").text("Please fill all the fields");
	
	if(passwordConfirm !== password) 
		$("#registerError").text("Passwords don't match");
	

	let newUser = {
		username,
		password
	}

	$.ajax({
		url: "/api/register",
		data: JSON.stringify({user: newUser}),
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		success: function(responseJSON){
			$("#duplicateUserSpan").text("");
			globalVars.globalUser = responseJSON.user;
		},
		error: function(error){
			$("#duplicateUserSpan").text("User already exists, try again.");
		}
	});

});

$("#loginForm").on("submit", function(event) {
	event.preventDefault();

	let newUser = {
		username: $("#userNameInputLogin").val(),
		password: $("#passwordInputLogin").val()
	}

	$.ajax({
		url: "/api/login",
		data: JSON.stringify({user: newUser}),
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		success: function(responseJSON){
			$("#wrongPasswordSpan").text("");
			//window.user = responseJSON.user.username;
			console.log(JSON.stringify(responseJSON.user));
			localStorage.setItem('globalUser', JSON.stringify(responseJSON.user));
		},
		error: function(error){
			$("#wrongPasswordSpan").text("Password and user dont match")
		}
	});
});

