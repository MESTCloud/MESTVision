var $RoleCollectorId;

$(function() {

	/*角色：设置自适应滚动条*/
	$("#divrole").css("height", pFrameHeight - pTitleHeight - 30);

	/*采集信息：设置自适应滚动条*/
	$("#divcollector").css("height", pFrameHeight - pTitleHeight - 30);

	
	checkAll("#checkAll","check_table");
	$("tbody").bind("click", function() {
		
		radioAll("#checkAll","check_table");
	});

	$("#RoleCollector_Add").on("click", function() {
		/*保存内容*/
		var ckbs = $("input[name='check_table']:checked");
		var CollectorArray = [];
		ckbs.each(function() {
			CollectorArray.push($(this).attr("data-Collectorid"));
		});

		var jsStr = "AddCollectorToRole {\"id\":\"" + $RoleCollectorId + "\",\"CollectorIds\":\"" + CollectorArray.join(',') + "\"}";
		send(jsStr);
	});
});

/*角色数据绑定*/
function bindRoleTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {
			str += "<tr class='gradeX even' role='row' data-Roleid='" + data["RoleId"] + "'>"
			str += "<td>";
			str += "<span>" + data["RealName"] + "</span></td>";
			str += "</tr>";
		});
	}
	return str;
}

/*采集器数据绑定*/
function bindCollectorTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {
			str += "<tr class='gradeX even' role='row'>"
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' data-Collectorid ='" + data["ID"] + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			data["CollectorDescription"] = data["CollectorDescription"] == null ? "" : data["CollectorDescription"];
			str += "<td>" + data["CollectorName"] + "</td>";
			str += "<td>" + data["CollectorDescription"] + "</td>";
			str += "</tr>";
		});
	}

	return str;
}

/*点击左侧的选中右侧复选框*/
function RoleToCollector(Collectorid) {
	var $rightr = $(".RoleCollector_right tbody tr");
	for(var i = 0; i < $rightr.length; i++) {

		if($rightr.find("td label >input").eq(i).attr("data-Collectorid") == Collectorid) {
			$rightr.find("td label >input").eq(i).prop('checked', true);
		}
	}
}

//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}

	send("RoleList");
	send("CollectorList");
}

//收到消息
socket.onmessage = function(msg) {
		var result = msg.data;
		result = JSON.parse(result);
		if(result["error"]) {
			shalert(result["error"]);
		}
		/*	else if(result["exception"]) {
				shalert(result["exception"]);
			} */
		else {
			switch(result["Function"]) {
				case "RoleList":
					$(".RoleCollector_left tbody").html(bindRoleTable(result["data"]));
					/*获取采集器信息*/
					$(".RoleCollector_left tbody tr").click(function() {
						$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style");
						$RoleCollectorId = $(this).attr("data-Roleid");

						var jsStr = "CollectorListByRole {\"id\":\"" + $RoleCollectorId + "\"}";

						send(jsStr);
					});
					break;

				case "CollectorList":
					$(".RoleCollector_right tbody").html(bindCollectorTable(result["data"]));
					break;

				case "CollectorListByRole":
					$(":checkbox").prop('checked', false);
					if(result["data"].length > 0) {
						for(var i = 0; i < result["data"].length; i++) {
							RoleToCollector(result["data"][i].ID);
						}
						if(result["data"].length == $(".RoleCollector_right tbody tr").length) {
							$("#checkAll").prop('checked', true);
						} else {
							$("#checkAll").prop('checked', false);
						}
					}
					break;

				case "AddCollectorToRole":
					shalert(result["info"]);
					break;
			}
		}
	}

//连接断开
socket.onclose = function(event) {
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