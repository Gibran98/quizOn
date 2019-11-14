$("#registerForm").on("submit", function(event) {
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
		url: "/api/postUser",
		data: JSON.stringify({user: newUser}),
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		success: function(responseJSON){
			console.log("Successfully created user"); //TODO
		},
		error: function(error){
			console.log("Error: " + error);
		}
	});

});
/*
TODO
$("#loginForm").on("submit", function(event) {
	let username = $("#userNameInputLogin").val();
	let password = $("#passwordInputLogin").val();

	$.ajax({
		url: "/api/getUserByName/" + username,
		method: "GET",
		dataType: "json",
		success: function(responseJSON){
			
		},
		error: function(error){
			console.log("Error");
		}
	});


});*/

