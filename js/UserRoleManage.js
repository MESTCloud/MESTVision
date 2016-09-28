$(function(){
	/*用户数据绑定*/
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

	
	/*角色数据绑定*/
	
	
	
	
	
	$(".userRole_left tbody tr").on("click",function(){
		var $roleid=$(this).attr("data_roleid");
		if($roleid!="undefined"){
		var $inputr=$(".userRole_right tbody tr input");
		
		for(var i=0;i<$inputr.length;i++){
			$inputr.eq(i).prop('checked', false);
			if($inputr.eq(i).attr("data-rid")==$roleid){
				$inputr.eq(i).prop('checked', true);
			}
		}
		}
	});
	/*保存*/
	$("#userRole_Add").on("click",function(){
		{
			/*保存操作*/
		}
	})
});

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

				UserData = result["data"]
				$("tbody").html(bindTable(result["data"]));
				
				break;
			case "AddUser":
				shalert("添加成功");

				var obj = {
					"Id": result["info"],
					"Mobile": $("#inputphone_Add").val().trim(),
					"RealName": $("#name_Add").val().trim(),
					"UserName": $("#login_Add").val().trim(),
					"RoleName": $("#inputRole_Add  option:selected").text().trim()
				};

				UserData.push(obj);
				$("tbody").append(AddUser(obj));
				$('#myModal_Add').modal('hide');
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
					console.log(AddUser(obj));
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