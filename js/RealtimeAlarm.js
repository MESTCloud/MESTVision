var RealTimeAlarmData;
var fileName1;

$(document).ready(function() {
	/*设置自适应滚动条*/
	$("#divtable").css("height", pFrameHeight - pTitleHeight - pConditionHeight - 30);

	/*二维码的点击事件*/
	$("#QRcode").on("click", function() {

		$("#div_QRcode").toggle("slow");
	});

	/*全选 反选*/
	$("#checkAll").click(function() {
		if(this.checked) {

			$("input[name='check_table']").prop('checked', true);

		} else {
			$("input[name='check_table']").prop('checked', false);
		}
	});

	/*单选全选后,全选按钮选中*/
	$("tbody").bind("click", function() {
		var $check = $("input[name='check_table']:checked");
		var ototal = $check.length;

		if($("input[name='check_table']").length == ototal) {
			$("#checkAll").prop("checked", true);
		} else {
			$("#checkAll").prop("checked", false);
		}
	});

	/*查询按钮点击事件*/
	$("#btnQuery").click(function() {
		// 获取指定时间段内实时报警数据
		sendCheckTimeData();
	});

	/*确认选中按钮点击事件*/
	$("#btnConfirmationCheck").click(function() {
		//当复选框已经被选中后
		indexsDel = CheckedLength("check");

		if(indexsDel) {
			shconfirm("确认要确认多条报警吗?", function(result) {
				var id = "";
				if(result) {
					var jsStr = "ConfirmMultiAlarmTagInfo {\"id\":\"";
					for(var i = 0; i < indexsDel.length; i++) {

						jsStr += RealTimeAlarmData[indexsDel[i]]["AlarmID"] + "\,";
					}
					jsStr = jsStr.substring(0, jsStr.length - 1) + "\"";
					jsStr += "}";
				}
				send(jsStr);
			});
		}
	});

	/*全部确认按钮点击事件*/
	$("#btnConfirmAllAlarmData ").click(function() {
		//当复选框已经被选中后
		indexsDel = CheckedLength("check");

		if(indexsDel) {
			shconfirm("确认要确认所有报警吗?", function(result) {
				if(result) {
					send(ConfirmAllAlarmTagInfo);
				};
			});
		};
	});

	//导出功能
	$("#btnOutputExcel").on("click", function() {

		/*开始日期*/
		var pStime = $("#startTime").val().trim();

		/*结束日期*/
		var pEtime = $("#endTime").val().trim();

		var jsStr = "OutputRealTimeAlarmInfo {\"username\":\"" + $.cookie("user") + "\",\"startTime\":\"" + pStime + "\",\"endTime\":\"" + pEtime + "\"}";
		send(jsStr);
	});
});

// 获取指定时间段内实时报警数据
function sendCheckTimeData() {
	/*开始日期*/
	var pStime = $("#startTime").val().trim();

	/*结束日期*/
	var pEtime = $("#endTime").val().trim();

	if(pStime == "") {
		shalert("开始日期不能为空！");
		return false;
	}
	if(pEtime == "") {
		shalert("结束日期不能为空！");
		return false;
	}

	if(pStime != "" && pEtime != "" && pStime > pEtime) {
		shalert("结束日期不能大于开始日期！");
		return false;
	}

	var jsStr = "CheckRealTimeAlarmInfo {\"username\":\"" + $.cookie("user") + "\",\"startTime\":\"" + pStime + "\",\"endTime\":\"" + pEtime + "\"}";
	send(jsStr);
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

/*获取table集合*/
function bindTable(datatable) {
	var str = "";
	if(datatable.length > 0) {
		$.each(datatable, function(index, data) {
			// 结束时间
			var pEndTime = data["EndTime"] == null ? "" : data["EndTime"];

			if(data["Severity"] == "高高报") {
				str += "<tr class='fontred' role='row'>";
			} else if(data["Severity"] == "高报") {
				str += "<tr class='fontblue' role='row'>";
			} else if(data["Severity"] == "低报") {
				str += "<tr class='fontviolet' role='row'>";
			} else if(data["Severity"] == "低低报") {
				str += "<tr class='fontgreen' role='row'>";
			}
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + index + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td>" + data["TagName"] + "</td>";
			str += "<td>" + data["Description"] + "</td>";
			str += "<td>" + data["Severity"] + "</td>";
			str += "<td>" + data["StartTime"] + "</td>";
			str += "<td>" + pEndTime + "</td>";
			str += "<td>" + data["AlarmValue"] + "</td>";
			str += "<td>" + data["AlarmStandard"] + "</td>";
			str += "<td>";

			if(data["Acked"] != 1) {
				str += "<button type='button' class='btn btn1 btn-success btnConfirmAlarm'   data-value='" + data["AlarmID"] + "'>";
				str += "<span>确认报警</span></button>"
			}

			str += "</td>"
			str += "</tr>";
		});
	}

	return str;
}

// 确认按钮点击事件
function ConfirmAlarmData(pAlarmID) {
	var jsStr = "ConfirmOneAlarmTagInfo {\"id\":\"" + pAlarmID + "\"}";
	send(jsStr);
}

//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}
	senddata();
}

// 获取所有实时报警数据
function senddata() {
	send("RealTimeAlarmInfo {\"username\":\"" + $.cookie("user") + "\"}");
}

//收到消息
socket.onmessage = function(msg) {
	var result = msg.data;
	if(typeof result=="string") {
		result = JSON.parse(result);
		if(result["error"]) {
			shalert(result["error"]);
		}
		/*else if(result["exception"]) {
			shalert(result["exception"]);
		} */
		else {
			switch(result["Function"]) {
				case "RealTimeAlarmInfo":
					RealTimeAlarmData = result["data"];

					if(result["data"].length == 0) {
						shalert("查无资料");
						$("tbody").html("");
					}
					$("tbody").html(bindTable(result["data"]));

					/*确认报警按钮点击事件*/
					$(".btnConfirmAlarm").click(function() {
						var pAlarmID = this.getAttribute("data-value");
						shconfirm("确认要确认报警吗?", function(result) {
							if(result) {
								ConfirmAlarmData(pAlarmID);
							};
						});
					});
					break;

				case "CheckRealTimeAlarmInfo":
					RealTimeAlarmData = result["data"];
					if(result["data"].length == 0) {
						shalert("查无资料");
						$("tbody").html("");
					}
					$("tbody").html(bindTable(result["data"]));
					/*确认报警按钮点击事件*/
					$(".btnConfirmAlarm").click(function() {
						var pAlarmID = this.getAttribute("data-value");
						shconfirm("确认要确认报警吗?", function(result) {
							if(result) {
								ConfirmAlarmData(pAlarmID);
							};
						});
					});

					break;
				case "ConfirmOneAlarmTagInfo":
					shalert("确认成功");

					/*开始日期*/
					var pStime = $("#startTime").val().trim();

					/*结束日期*/
					var pEtime = $("#endTime").val().trim();

					if(pStime == "" && pEtime == "") {
						// 获取所有实时报警数据
						senddata();
					} else {
						// 获取指定时间段内实时报警数据
						sendCheckTimeData();
					}

					break;
				case "ConfirmMultiAlarmTagInfo":
					shalert("确认成功");
					/*开始日期*/
					var pStime = $("#startTime").val().trim();

					/*结束日期*/
					var pEtime = $("#endTime").val().trim();

					if(pStime == "" && pEtime == "") {
						// 获取所有实时报警数据
						senddata();
					} else {
						// 获取指定时间段内实时报警数据
						sendCheckTimeData();
					}
					break;
					/*导出*/
				case "OutputRealTimeAlarmInfo":

					var jsStr = "DownLoadFile {\"filename\":\"" + result["info"].replace("\\", "/") + "\"}";
					fileName1 = result["info"].replace("\\", "/");
					send(jsStr);
					break;

			}
		}
	} else {
		try {
			var blob = new Blob([msg.data], {
					type: "applicationnd.ms-excel"
				}),
				fileName = fileName1.split('/')[1];
			var link = document.createElement('a');
			window.URL=window.URL||window.webkitURL;
			link.href = window.URL.createObjectURL(blob);
			link.download = fileName;
			if(document.all) {　　
				link.click();　　
			}　　
			else {　　
				var evt = document.createEvent("MouseEvents");　　
				evt.initEvent("click", true, true);　　
				link.dispatchEvent(evt);　　
			}
			window.URL.revokeObjectURL(link.href);

		} catch(e) {
			shalert(e);
			return false;
		}
	}
}

//连接断开
socket.onclose = function(event) {
	console.log("Socket状态:" + readyStatus[socket.readyState]);
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