var $RoleUserId;
$(function() {

	$("#checkAll").click(
		function() {
			if(this.checked) {

				$("input[name='check_table']").prop('checked', true);

			} else {
				$("input[name='check_table']").prop('checked', false);

			}
		}
	);
	$("tbody").bind("click", function() {
		var $check = $("input[name='check_table']:checked");
		var ototal = $check.length;

		if($("input[name='check_table']").length == ototal) {
			$("#checkAll").prop("checked", true);
		} else {
			$("#checkAll").prop("checked", false);
		}
	});
	$("#RoleUser_Add").on("click", function() {
		/*保存内容*/
		var ckbs = $("input[name='check_table']:checked");
		var UserArray = [];
		ckbs.each(function() {
			UserArray.push($(this).attr("data-userid"));

		});

		var jsStr = "AddUserToRole {\"id\":\"" + UserArray.join(",") + "\",\"role\":\"" + $RoleUserId + "\"}";
		send(jsStr);
		//alert($RoleUserId);
	});
});
/*用户数据绑定*/
function bindUserTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			str += "<tr class='gradeX even' role='row'>"
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' data-userid ='" + data["Id"] + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
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
			str += "<tr class='gradeX even' role='row' data-roldId='" + data["RoleId"] + "'>"
			str += "<td>";
			str += "<span>" + data["RealName"] + "</span></td>";
			str += "</tr>";

		});

	}

	return str;
}
/*点击左侧的选中右侧复选框*/
function RoleToUser(userid) {
	var $rightr = $(".Roleuser_right tbody tr");

	for(var i = 0; i < $rightr.length; i++) {

		if($rightr.find("td label >input").eq(i).attr("data-userid") == userid) {
			$rightr.find("td label >input").eq(i).prop('checked', true);
			
		}
	}

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
		} 
		/*else if(result["exception"]) {
			shalert(result["exception"]);
		} */
		else {
			switch(result["Function"]) {
				case "UserList":

					$(".Roleuser_right tbody").html(bindUserTable(result["data"]));

					break;
				case "RoleList":

					$(".Roleuser_left tbody").html(bindRoleTable(result["data"]));
					$(".Roleuser_left tbody tr").click(function() {
                    $(this).attr("style","background-color: #DAF3F5").siblings().removeAttr("style");
						$RoleUserId = $(this).attr("data-roldId");

						var jsStr = "UserListByRole {\"id\":\"" + $RoleUserId + "\"}";

						send(jsStr);
					});
					break;
				case "UserListByRole":
					  $(":checkbox").prop('checked', false);
					if(result["data"].length > 0) {

						for(var i = 0; i < result["data"].length; i++) {
							RoleToUser(result["data"][i].Id);
						}
						if(result["data"].length == $(".Roleuser_right tbody tr").length) {
							$("#checkAll").prop('checked', true);
						} else {
							$("#checkAll").prop('checked', false);
						}
					}

					break;
				case "AddUserToRole":
					shalert(result["info"]);
					break;

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




