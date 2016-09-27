/*交互*/
/*$(function() {
	$.ajax({
		url: "../js/json",
		type: "get",
		dataType: "json",
		success: function(data) {
			$("tbody").html(bindTable(data));
		}
	});
});*/
/*获取集合*/
function bindTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			if(parseInt(index) / 2 == 0) {
				str += "<tr class='gradeX odd' role='row'>"
			} else {
				str += "<tr class='gradeX even' role='row'>"
			}
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + index + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td class='sorting_1'>" + data["UserName"] + "</td>";
			str += "<td>" + data["RealName"] + "</td>";
			str += "<td>" + data["Mobile"] + "</td>";
			str += "<td>" + data["RoleName"] + "</td>";
			str += "</tr>";

		});

	}

	return str;
}

/*复选框操作*/
$(function() {
	/*全选 反选*/
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

	/*删除user_delete*/
	$("#user_delete").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			shconfirm("确定要删除吗", function(result) {
				if(result) {
					/* 对删除进行交互;*/
				}
			});
		}
	});
	$("#del_user").click(function() {
		shalert("删除操作");

	});

	$("#check_cancel").click(function() {
		$("#User_Check").hide();
	});
	/*修改*/
	$("#user_update").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");
			$('#myModal_Update').modal('show');
			var idIndex = $("input[name='check_table']:checked").val();
			console.log(idIndex);
			send("userlist");

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
							var obj=result["data"][idIndex];
                               $("#login_Update").val(obj["UserName"]);
                               $("#name_Update").val(obj["RealName"]);
                               $("#inputphone_Update").val(obj["Mobile"]);
                               $("#select_role").find("option[text='"+obj['RoleName']+"']").attr("selected",true);
                               UpdateUser(obj["Id"]);
                               
							break;

					}

				}
			}

		}

	});
	/*密码重置*/
	$("#user_password").click(function() {
		if(CheckedLength()) {
			$("#user_password").prop("data-toggle", "modal");
			$('#myModal_PassWordUpdate').modal('show')
		}
	});
	/*对全选项的判定*/
	function CheckedLength() {
		var oChecked = document.getElementsByName("check_table");
		var total = 0;
		for(var i = 0; i < oChecked.length; i++) {
			if(oChecked[i].checked) {
				total++;
			}
		}
		if(total == 0) {
			shalert('请选择操作项！');
			return false;
		} else if(total != 1) {
			shalert('请选择一项进行操作！');
			return false;
		} else {
			return true;
		}

	}

});
/*文本框的判定*/
$(function() {

	/*新增*/
	$("#save_Add").click(function() {
		if($("#login_Add").val().trim() == "") {

			shalert("登录名不能为空！");
			$("#login_Add").focus();
			return false;
		}
		if($("#name_Add").val().trim() == "") {
			shalert("姓名不能为空！");
			$("#name_Add").focus();
			return false;
		}
		if($("#inputphone_Add").val().trim() == "") {
			shalert("手机号不能为空！");
			$("#inputphone_Add").focus();
			return false;
		} else {
			var phone = document.getElementById('inputphone_Add').value;
			if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
				shalert("手机号码有误，请重填");
				$("#inputphone_Add").focus();
				return false;
			}
		}

		if($("#inputPassword_Add").val().trim() == "") {
			shalert("密码不能为空！");
			$("#inputPassword_Add").focus();
			return false;
		}
		if($("#inputPassword2_Add").val().trim() == "") {
			shalert("请再次填写密码！");
			$("#inputPassword2_Add").focus();
			return false;
		}

		if($("#inputPassword_Add").val().trim() != $("#inputPassword2_Add").val().trim()) {
			shalert("两次密码不一致，请重新填写");
			$("#inputPassword2_Add").val("");
			$("#inputPassword2_Add").focus();
			return false;
		}
		var jsStr = "AddUser {\"username\":\"" + $("#login_Add").val().trim() + "\",\"realname\":\"" + $("#name_Add").val().trim() + "\",\"password\":\"" + $("#inputPassword_Add").val().trim() + "\",\"mobile\":\"" + $("#inputphone_Add").val().trim() + "\",\"role\":\"" + $("#inputRole_Add").val().trim() + "\"}";
		// "AddUser {\"username\":\"" + $("#login_Add").val().trim() + "\",\"realname\":\"" + $("#name_Add").val().trim() + "\",\"password\":\"" + $("#inputPassword_Add").val().trim() + "\",\"mobile\":\""+ $("#inputphone_Add").val().trim() + "\",\"role\":\"" + $("#check_Add").val().trim() + "\",}";
		console.log(jsStr);
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
					case "AddUser":
						shalert("添加成功");
						return false;

				}
			}
		}

	});
	/*修改*/
	function UpdateUser(userid)
	{
		$("#save_Update").click(function() {
		if($("#login_Update").val().trim() == "") {
			shalert("登录名不能为空！");
			$("#login_Update").focus();
			return false;
		}
		if($("#name_Update").val().trim() == "") {
			shalert("姓名不能为空！");
			$("#name_Update").focus();
			return false;
		}
		if($("#inputphone_Update").val().trim() == "") {
			shalert("手机号不能为空！");
			$("#inputphone_Update").focus();
			return false;
		} else {

			var phone = document.getElementById('inputphone_Update').value;
			if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
				shalert("手机号码有误，请重填");
				$("#inputphone_Update").focus();
				return false;
			}
		}
		if($("#inputPassword_Update").val().trim() == "") {
			shalert("密码不能为空！");
			$("#inputPassword_Add").focus();
			return false;
		}
		if($("#inputPassword_Update2").val().trim() == "") {
			shalert("请再次填写密码！");
			$("#inputPassword2_Add").focus();
			return false;
		}

		if($("#inputPassword_Add").val().trim() != $("#inputPassword2_Add").val().trim()) {
			shalert("两次密码不一致，请重新填写");
			$("#inputPassword2_Add").val("");
			$("#inputPassword2_Add").focus();
			return false;
		}

		var jsStr = "UpdateUser {\"Id\":\"" + userid + "\",\"realname\":\"" + $("#name_Add").val().trim() + "\",\"password\":\"" + $("#inputPassword_Add").val().trim() + "\",\"mobile\":\"" + $("#inputphone_Add").val().trim() + "\",\"role\":\"" + $("#inputRole_Add").val().trim() + "\"}";
		// "AddUser {\"username\":\"" + $("#login_Add").val().trim() + "\",\"realname\":\"" + $("#name_Add").val().trim() + "\",\"password\":\"" + $("#inputPassword_Add").val().trim() + "\",\"mobile\":\""+ $("#inputphone_Add").val().trim() + "\",\"role\":\"" + $("#check_Add").val().trim() + "\",}";
		console.log(jsStr);
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
					case "UpdateUser":
						shalert("修改成功！");
						return false;
                     
				}
			}
		}
	});

	}
	
	/*密码重置*/
	$("#save_inputPassWordUpdate").click(function() {
		if($("#inputPassWordUpdate").val().trim() == "" || $("#inputPassWordUpdate2").val().trim() == "") {
			shalert("密码不能为空");
			return false;
		}
		if($("#inputPassWordUpdate").val().trim() != $("#inputPassWordUpdate2").val().trim()) {
			shalert("两次密码不一致，请重新填写");
			$("#inputPassWordUpdate2").val("");
			$("#inputPassWordUpdate2").focus();
			return false;
		}
	});
})

//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {

		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}

	send("userlist");
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
				console.log(result["data"]);

				$("tbody").html(bindTable(result["data"]));
				break;

		}

	}
}

//连接断开
socket.onclose = function(event) {
	console.log("Socket状态:" + readyStatus[socket.readyState]);
	//location.href = "http://www.baidu.com";
}

//发送
function send(msg) {
	socket.send(msg);
}

//断开连接
function disconnect() {
	socket.close();
}