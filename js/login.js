$(function() {
	/*获取地址栏中的值*/
	if(window.location.search.split('=')[1] == 1) {
		$.cookie("user", "");
		$.cookie("password", "");
	} else {
		$.cookie("password", "");
		$("#username").val($.cookie("user"));
		$("#password").val("");
	}
	document.onkeydown = function(event) {

		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode == 13) { // enter 键
          	login();
		
		}
	}
	$("#loginClick").on("click", function() {
		/*判定*/
		login();

	});

	/*$("#loginClick").keydown(function(event){
		alert(event.keyCode);
	});*/
	function login() {
		
		if($("#username").val().trim() == "") {
			shalert('用户名不能为空');
			return false;
		}

		if($("#password").val().trim() == "") {
			shalert('密码不能为空');
			return false;
		}
		var jsStr = "Login {\"username\":\"" + $("#username").val().trim() + "\",\"password\":\"" + $("#password").val().trim() + "\"}";
		send(jsStr);
	}
	//连接成功
	socket.onopen = function() {
		//console.log("连接成功");

	}
	socket.onmessage = function(msg) {
		var result = msg.data;
		result = JSON.parse(result);
		if(result["error"]) {
			console.log(result["error"]);
			shalert(result["error"]);
		} else if(result["exception"]) {
			shalert(result["exception"]);
		} else {
			switch(result["Function"]) {
				case "Login":
					//shalert("Login:" + result["info"]);
					
					$.cookie("realName", result["info"]);
					$.cookie("user", $("#username").val().trim());
					$.cookie("password", $("#password").val().trim());
					window.location.href = "Index.html";
					break;
				case "ChangePassword":

					if(result["info"].toString().trim() != "") {
						shalert(result["info"]);
					} else {
						shalert("密码修改成功！");
					}

					$('#myModal_PassWordUpdate').modal('hide');
					break;
				default:
					shalert(result);
					break;
			}
		}
	}

});