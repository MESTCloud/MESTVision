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

	});



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