var UserData;
/*复选框操作*/
var indexsDel;
var idIndexUpdate;
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
		indexsDel = CheckedLength("del");

		if(indexsDel) {
			shconfirm("确定要删除吗", function(result) {
				var id = "";
				if(result) {

					var jsStr = "DeleteUser {\"id\":\"";
					for(var i = 0; i < indexsDel.length; i++) {

						jsStr += UserData[indexsDel[i]]["Id"] + "\,";

					}
					jsStr = jsStr.substring(0, jsStr.length - 1) + "\"";
					jsStr += "}";

				}
               
				send(jsStr);

			});
		}
	});

	/*修改*/
	$("#user_update").click(function() {
		
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");
			$('#myModal_Update').modal('show');
			idIndexUpdate = $("input[name='check_table']:checked").val();

			//send("userlist");
			var obj = UserData[idIndexUpdate];
			
			$("#login_Update").val(obj["UserName"]);
			$("#name_Update").val(obj["RealName"]);
			$("#inputphone_Update").val(obj["Mobile"]);
			$("#select_role_update").val(obj["RoleId"]);
			UpdateUser(obj["Id"]);
		}

	});
	/*修改*/
	function UpdateUser(userid) {
		$("#save_Update").unbind("click");
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

			var jsStr = "UpdateUser {\"id\":\"" + userid + "\",\"realname\":\"" + $("#name_Update").val().trim() + "\",\"mobile\":\"" + $("#inputphone_Update").val().trim() + "\",\"role\":\"" + $("#select_role_update").val().trim() + "\"}";

			send(jsStr);
		});

	}

	/*密码重置*/
	$("#user_password").click(function() {
		var idIndes = CheckedLength("updete");
		if(idIndes) {
			$("#user_password").prop("data-toggle", "modal");
			$('#myModal_PassWordUpdate').modal('show');
			/*var idIndex = $("input[name='check_table']:checked").val();
			var obj = UserData[idIndex];
			PassWordUpdate(obj["Id"]);*/
			var jsStr = '';
			for(var i = 0; i < idIndes.length; i++) {
				jsStr += UserData[idIndes[i]]["Id"] + "\,";
			}
			jsStr = jsStr.substring(0, jsStr.length - 1) + "\"";

			PassWordUpdate(jsStr);

		}
	});

	/*密码重置*/
	function PassWordUpdate(ids) {
        $("#save_inputPassWordUpdate").unbind("click");
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
			var jsonStr = "SetPassword {\"id\":\"" + ids + "\,\"password\":\"" + $("#inputPassWordUpdate").val().trim() + "\"}";
            
			send(jsonStr);
		});
	}

	/*对全选项的判定*/
	function CheckedLength() {

		var oChecked = document.getElementsByName("check_table");
		var total = 0;
		var checked = [];
		for(var i = 0; i < oChecked.length; i++) {
			if(oChecked[i].checked) {
				total++;
				checked.push(oChecked[i].value);
			}
		}

		if(arguments.length > 0) {
			if(total == 0) {
				shalert('请选择操作项！');
				return false;
			} else {
				return checked;
			}
		} else {
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

		send(jsStr);
		
		

	});

})

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
			str += "<td style='word-break: break-all; word-wrap:break-word;'>" + data["UserName"] + "</td>";
			str += "<td>" + data["RealName"] + "</td>";
			str += "<td>" + data["Mobile"] + "</td>";
			str += "<td>" + data["RoleName"] + "</td>";
			str += "</tr>";

		});

	}

	return str;
}

function AddUser(datatable) {
	var str = "";
	//var length = parseInt(UserData.length) - 1;
	str += "<tr class='gradeX even' role='row'>"

	str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
	str += "<input type='checkbox' class='checkboxes' value='" + datatable["value"]  + "' name='check_table'>";
	str += "<span></span>";
	str += "</label> </td>";
	str += "<td class='sorting_1'>" + datatable["UserName"] + "</td>";
	str += "<td>" + datatable["RealName"] + "</td>";
	str += "<td>" + datatable["Mobile"] + "</td>";
	str += "<td>" + datatable["RoleName"] + "</td>";
	str += "</tr>";
	return str;
}
/*角色绑定*/
function roleBind(data) {
	var strRole = "<option value='0'></option>";
	if(data.length > 0) {
		$.each(data, function(index, item) {
			strRole += "<option value=" + item["RoleId"] + ">" + item["RealName"] + "</option>";
		});
	}

	return strRole;

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

				UserData = result["data"];
				$("tbody").html(bindTable(result["data"]));
				
				break;

			case "AddUser":
				shalert("添加成功");
                 var valuel=parseInt(UserData.length);
				var obj = {
					"value":valuel,
					"Id": result["info"],
					"Mobile": $("#inputphone_Add").val().trim(),
					"RealName": $("#name_Add").val().trim(),
					"UserName": $("#login_Add").val().trim(),
					"RoleId": $("#inputRole_Add").val().trim(),
					"RoleName": $("#inputRole_Add option:selected").text()
				};

				UserData.push(obj);
				
				$("tbody").append(AddUser(obj));
				$('#myModal_Add').modal('hide');
				
				/* 清空栏位：登录名，姓名，手机号码，默认角色，密码，确认密码*/
				$("#login_Add").val("");
				$("#name_Add").val("");
				$("#inputphone_Add").val("");
				$("#inputPassword_Add").val("");
				$("#inputPassword2_Add").val("");
				$("#inputRole_Add").val("10000009");
				
				break;
			case "UpdateUser":
				shalert("修改成功");
				var ckbs = $("input[name='check_table']:checked");
               
				var obj = {
					
					"Id": UserData[idIndexUpdate].Id,
					"Mobile": $("#inputphone_Update").val().trim(),
					"RealName": $("#name_Update").val().trim(),
					"UserName": $("#login_Update").val().trim(),
					"RoleName": $("#select_role_update  option:selected").text().trim()
				};
               
				UserData[idIndexUpdate].Mobile = $("#inputphone_Update").val().trim();
				UserData[idIndexUpdate].RealName = $("#name_Update").val().trim();
				UserData[idIndexUpdate].UserName = $("#login_Update").val().trim();
				UserData[idIndexUpdate].RoleName = $("#select_role_update").text().trim();
				
				ckbs.each(function() {
                   obj.value=$(this).val();
					$(this).parent().parent().parent().replaceWith(AddUser(obj));

				});
				$('#myModal_Update').modal('hide');
				break;
			case "DeleteUser":

				var ckbs = $("input[name='check_table']:checked");
				ckbs.each(function() {
					$(this).parent().parent().parent().remove();

				});

				shalert("删除成功");
				break;
			case "RoleList":
				$("#inputRole_Add").html(roleBind(result["data"]));
				$("#select_role_update").html(roleBind(result["data"]));
				break;

			case "SetPassword":
				shalert("密码修改成功！");
				
				$('#myModal_PassWordUpdate').modal('hide');
				$("#inputPassWordUpdate").val("");
				$("#inputPassWordUpdate2").val("");
				break;

		}

	}
}

//连接断开
socket.onclose = function(event) {
	//console.log("Socket状态:" + readyStatus[socket.readyState]);
	//location.href = "http://www.baidu.com";
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