var UserData = "";
var indexsDel;
var idIndexUpdate;
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
			str += "<td>" + data["RoleId"] + "</td>";
			str += "<td>" + data["RealName"] + "</td>";

			str += "</tr>";

		});

	}

	return str;
}

function AddRole(datatable) {
	var str = "";
	var length = parseInt(UserData.length) - 1;
	str += "<tr class='gradeX even' role='row'>"

	str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + length + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td>" + datatable["RoleId"] + "</td>";
			str += "<td>" + datatable["RealName"] + "</td>";

			str += "</tr>";
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

	$("tbody").click(function() {
		var $check = $("input[name='check_table']:checked");
		var ototal = $check.length;

		if($("input[name='check_table']").length == ototal) {
			$("#checkAll").prop("checked", true);
		} else {
			$("#checkAll").prop("checked", false);
		}

	});
	/*删除user_delete*/
	$("#Role_delete").click(function() {
		//当复选框已经被选中后
		var RoleIndex = CheckedLength("del");
		if(RoleIndex) {
			shconfirm("确定要删除吗", function(result) {
				if(result) {
					var jsStr = "DeleteRole {\"id\":\"";
					for(var i = 0; i < RoleIndex.length; i++) {
						jsStr += UserData[RoleIndex[i]]["RoleId"] + "\,";

					}
					jsStr = jsStr.substring(0, jsStr.length - 1) + "\"";
					jsStr += "}";
					console.log(jsStr);

				}
				send(jsStr);
			});
		}
	});
	/* $("#del_Role").click(function(){
	     shalert("删除操作");
	 });*/

	$("#check_cancel").click(function() {
		$("#User_Check").hide();
	});
	/*修改*/
	$("#Role_update").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");
			$('#myModal_Update').modal('show');
			idIndexUpdate = $("input[name='check_table']:checked").val();
			//send("userlist");
			var obj = UserData[idIndexUpdate];
			$("#Name_update").val(obj["RealName"]);
			$("#Number_Update").val(obj["RoleId"]);
			UpdateRole(obj["RoleId"]);
		}

	});

	function UpdateRole(Roleid) {

		/*修改*/
		$("#Rolesave_Update").click(function() {
			if($("#Name_update").val().trim() == "") {
				shalert("姓名不能为空！");
				$("#Name_update").focus();
				return false;
			}

			var jsStr = "UpdateRole {\"id\":\"" + Roleid + "\",\"realname\":\"" +  $("#Name_update").val().trim() + "\"}";
			
			send(jsStr);

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
		$("#Rolesave_Add").click(function() {
			if($("#Name_Add").val().trim() == "") {
				shalert("姓名不能为空！");
				$("#Name_Add").focus();
				return false;
			}

			var jsStr = "AddRole {\"realname\":\"" + $("#Name_Add").val().trim() + "\"}";

			send(jsStr);

		});

	})
	//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}

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
			case "RoleList":
				UserData = result["data"];
				
				$("tbody").html(bindTable(result["data"]));
				break;
			case "AddRole": 
				shalert("添加成功！");

					var obj = {
					"RoleId": result["info"],
				
					"RealName": $("#Name_Add").val().trim(),
					
				};				

				UserData.push(obj);
				$("tbody").append(AddRole(obj));
				$('#myModal_Add').modal('hide');
				
								
				$("#Name_Add").val("");
				
				break;
			case "UpdateRole":
				shalert("修改成功");
				var ckbs = $("input[name='check_table']:checked");

				var obj = {
					"RoleId": UserData[idIndexUpdate].RoleId,
				
					"RealName": $("#Name_update").val().trim(),
				
				};

				;
				 UserData[idIndexUpdate].RealName = $("#Name_update").val().trim();
	
				ckbs.each(function() {
				
					$(this).parent().parent().parent().replaceWith(AddRole(obj));

				});
				$('#myModal_Update').modal('hide');
				
				$("#Name_Add").val("");
				
				break;
			case "DeleteRole":
			var ckbs = $("input[name='check_table']:checked");
				ckbs.each(function() {
					$(this).parent().parent().parent().remove();

				});
				shalert("删除成功");
				break;

		}

	}
}

//连接断开
socket.onclose = function(event) {
	//console.log("Socket状态:" + readyStatus[socket.readyState]);
	//location.href = "http://www.baidu.com";
	location.href = "../Login.html";
}

//发送
function send(msg) {
	socket.send(msg);
}

//断开连接
function disconnect() {
	socket.close();
}