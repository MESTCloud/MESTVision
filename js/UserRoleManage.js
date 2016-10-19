var $userId;/*保存点击用户时的id*/

/*保存*/
$("#userRole_Add").on("click", function() {
		{
			var ckbs = $("input[name='role_list']:checked");
			var roleId;
			ckbs.each(function() {
				roleId = $(this).parent().parent().find("label > input").attr("data-roldid");

			});

			var jsStr = "AddUserToRole {\"id\":\"" + $userId + "\",\"role\":\"" + roleId + "\"}";
			send(jsStr);
		}
	})
	/*用户数据绑定*/
function bindUserTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			str += "<tr  role='row' data-userid='" + data["Id"] + "'>"
			str += "<td >" + data["UserName"] + "</td>";
			str += "<td>" + data["RealName"] + "</td>";
			str += "</tr>";

		});

	}

	return str;
}
/*角色数据绑定*/
function bindRoleTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			str += "<tr  role='row'>"
			str += "<td> <label class='mt-radio mt-radio-outline'><input type='radio' name='role_list' value='success' data-roldId='" + data["RoleId"] + "'><span></span></label>";
			str += "<span>" + data["RealName"] + "</span></td>";
			str += "</tr>";

		});

	}

	return str;
}

//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}

	send("userlist");
	send("RoleList");

}

//收到消息
socket.onmessage = function(msg) {
		var result = msg.data;
		result = JSON.parse(result);
		if(result["error"]) {
			shalert(result["error"]);
		} else if(result["exception"]) {
			shalert(result["exception"]);
		} else {
			switch(result["Function"]) {
				case "UserList":
					
					$(".userRole_left tbody").html(bindUserTable(result["data"]));
					$(".userRole_left tbody tr").click(function() {
						 $(this).attr("style","background-color: #DAF3F5").siblings().removeAttr("style");
						$userId = $(this).attr("data-userid");
						var jsStr = "RoleListByUser {\"id\":\"" + $userId + "\"}";

						send(jsStr);
					});
					break;
				case "RoleList":
					
					$(".userRole_right tbody").html(bindRoleTable(result["data"]));
					break;
				case "RoleListByUser":
					var RoleId = result["data"][0].RoleId;

					checkedRido(RoleId)
					break;
				case "AddUserToRole":
					shalert(result["info"]);
					break;
			}

		}
	}
	/*选中角色*/
function checkedRido(RoleId) {
	if(RoleId != "undefined") {
		var $inputr = $(".userRole_right tbody tr input");

		for(var i = 0; i < $inputr.length; i++) {
			$inputr.eq(i).prop('checked', false);

			if($inputr.eq(i).attr("data-roldId") == RoleId) {
				$inputr.eq(i).prop('checked', true);
			}
		}
	}
}
//连接断开
socket.onclose = function(event) {
	//console.log("Socket状态:" + readyStatus[socket.readyState]);
	window.parent.location.href = "../Login.html";
}

//发送
function send(msg) {
	socket.send(msg);
}

//断开连接
function disconnect() {
	socket.close();
}