$(function() {
	
  /*密码重置*/
	$("#user_password").click(function() {
		
			$("#user_password").prop("data-toggle", "modal");
			$('#myModal_PassWordUpdate').modal('show')
		
	});
	/*密码重置*/
	$("#save_inputPassWordUpdate").click(function() {
		if($("#inputPassWordUpdate").val().trim() != $("#inputPassWordUpdate2").val().trim()) {
			shalert("两次密码不一致，请重新填写");
			$("#inputPassWordUpdate2").val("");
			$("#inputPassWordUpdate2").focus();
			return false;
		}
	});
	
	$("#loginClick").on("click", function() {
		/*判定*/

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

		socket.onmessage = function(msg) {
			var result = msg.data;
			result = JSON.parse(result);
			if(result["error"]) {
				shalert(result["error"]);
			} else if(result["exception"]) {
				shalert(result["exception"]);
			} else {
				switch(result["Function"]) {
					case "Login":
						//shalert("Login:" + result["info"]);
						$.cookie("user", $("#username").val().trim() );
						$.cookie("password", $("#password").val().trim());
						window.location.href = "Index.html";
						break;
					default:
						shalert(result);
						break;
				}
			}
		}
	});
   	
});