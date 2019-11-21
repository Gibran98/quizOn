localStorage.removeItem('globalUser');

$("#registerForm").on("submit", function(event) {
	event.preventDefault();

	let username = sanitize($("#userNameInputReg").val());
	let password = sanitize($("#passwordInputReg").val());
	let passwordConfirm = sanitize($("#passwordConfirmInputReg").val());

	if(username=="" || password=="" || passwordConfirm=="") {
		$("#registerError").text("Please fill all the fields");
		return;
	}
	
	if(passwordConfirm !== password) {
		$("#registerError").text("Passwords don't match");
		return;
	}

	if(password.length < 8) {
		$("#registerError").text("Password must have at least 8 characters");
		return;
	}
	

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
			localStorage.setItem('globalUser', JSON.stringify(responseJSON.user));
			window.location = "/index.html";
		},
		error: function(error){
			$("#registerError").text("User already exists, try again.");
		}
	});

});

$("#loginForm").on("submit", function(event) {
	event.preventDefault();

	let newUser = {
		username: sanitize($("#userNameInputLogin").val()),
		password: sanitize($("#passwordInputLogin").val())
	}

	$.ajax({
		url: "/api/login",
		data: JSON.stringify({user: newUser}),
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		success: function(responseJSON){
			localStorage.setItem('globalUser', JSON.stringify(responseJSON.user));
			window.location = "/index.html";
		},
		error: function(error){
			$("#wrongPasswordSpan").text("Password and user dont match")
		}
	});
});

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
  const reg = /[&<>"'/`]/ig;
  return string.replace(reg, (match)=>(map[match]));
}