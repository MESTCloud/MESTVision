var $UserCollectorId;

$(function() {

	/*用户：设置自适应滚动条*/
	$("#divuser").css("height", pFrameHeight - pTitleHeight - 30);

	/*采集器信息：设置自适应滚动条*/
	$("#divcollector").css("height", pFrameHeight - pTitleHeight - 30);

	/*复选框的操作*/

	checkAll("#checkAll","check_table");
	$("tbody").bind("click", function() {
		radioAll("#checkAll","check_table");
		
	});
	
	$("#UserCollector_Add").on("click", function() {
		/*保存内容*/
		var ckbs = $("input[name='check_table']:checked");
		var CollectorArray = [];
		ckbs.each(function() {
			CollectorArray.push($(this).attr("data-Collectorid"));
		});

		var jsStr = "AddCollectorToUser {\"id\":\"" + $UserCollectorId + "\",\"CollectorIds\":\"" + CollectorArray.join(',') + "\"}";
		send(jsStr);
	});
});

/*用户数据绑定*/
function bindUserTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {
			str += "<tr role='row' data-userid='" + data["Id"] + "'>"
			str += "<td >" + data["UserName"] + "</td>";
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
function UserToCollector(Collectorid) {
	var $rightr = $(".UserCollector_right tbody tr");
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
	send("userlist");
	send("CollectorList");
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
					$(".UserCollector_left tbody").html(bindUserTable(result["data"]));
					/*获取采集器信息*/
					$(".UserCollector_left tbody tr").click(function() {
						$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style");
						$UserCollectorId = $(this).attr("data-userid");

						var jsStr = "CollectorListByUser {\"id\":\"" + $UserCollectorId + "\"}";
						send(jsStr);
					});
					break;
					
				case "CollectorList":
					$(".UserCollector_right tbody").html(bindCollectorTable(result["data"]));
					break;
					
				case "CollectorListByUser":
					$(":checkbox").prop('checked', false);
					if(result["data"].length > 0) {
						for(var i = 0; i < result["data"].length; i++) {
							UserToCollector(result["data"][i].ID);
						}
						if(result["data"].length == $(".UserCollector_right tbody tr").length) {
							$("#checkAll").prop('checked', true);
						} else {
							$("#checkAll").prop('checked', false);
						}
					}
					break;
					
				case "AddCollectorToUser":
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