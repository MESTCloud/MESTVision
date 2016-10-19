var fileName1;
$(function() {
	/*日历控件响应*/

	switch(pType) {
		case "day":
			/*$("#startTime1").val(getNowFormatDate(0, 0, -1));
			$("#endTime1").val(getNowFormatDate(0, 0, 0));*/
			$("#divday").show();
			$("#divmonth").hide();
			$("#divyear").hide();
			break;
		case "month":
			/*$("#startTime2").val(getNowFormatDate(0, 0, 0));*/

			$("#divmonth").show();
			$("#divday").hide();
			$("#divyear").hide();
			break;
		case "year":
			/*$("#startTime3").val(getNowFormatDate(0, 0, 0));*/

			$("#divyear").show();
			$("#divday").hide();
			$("#divmonth").hide();
			break;
		default:
			/*$("#startTime1").val(getNowFormatDate(0, 0, -1));
			$("#endTime1").val(getNowFormatDate(0, 0, 0));*/
			$("#divday").show();
			$("#divmonth").hide();
			$("#divyear").hide();
			break;
	}
	/*获取当前系统时间*/
	function getNowFormatDate(gmonth, gdate, ghours) {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1 + gmonth; /*月*/
		var strDate = date.getDate() + gdate; /*日*/
		var strHouse = date.getMinutes()
		if(month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var Hours = date.getHours() + ghours;
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
			" " + Hours + seperator2 + " " + date.getMinutes(); +
		seperator2 + date.getSeconds();
		if(pType == "month") {
			currentdate = date.getFullYear() + seperator1 + month;
		} else if(pType == "year") {
			currentdate = date.getFullYear();
		}

		return currentdate;
	}

	/*获取当前月的第一天*/
	function getCurrentMonthFirst(st) {
		var date = new Date(st);
		date.setDate(1);
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}

	/*获取当前月的最后一天*/
	function getCurrentMonthLast(st) {
		var date = new Date(st);
		var currentMonth = date.getMonth();
		var nextMonth = ++currentMonth;
		var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
		var oneDay = 1000 * 60 * 60 * 24;
		date = new Date(nextMonthFirstDay - oneDay);
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}

	/*查询按钮点击事件*/
	$("#btnQuery").click(function() {

		/*报表名称*/
		var pName = getQueryString("name");

		/*开始日期*/
		var stime;

		/*结束日期*/
		var etime;

		switch(pType) {

			case "day":
				var startTime = $("#startTime1").val().trim();
				var endTime = $("#endTime1").val().trim();

				if(startTime == "") {
					shalert("开始日期不能为空！");
					return false;
				}
				if(endTime == "") {
					shalert("结束日期不能为空！");
					return false;
				}

				if(startTime != "" && endTime != "" && startTime > endTime) {
					shalert("结束日期不能大于开始日期！");
					return false;
				}
				stime = $("#startTime1").val();
				etime = $("#endTime1").val();
				break;
			case "month":

				if($("#startTime2").val().trim() == "") {

					shalert("日期不能为空！");
					return false;
				}
				stime = getCurrentMonthFirst($("#startTime2").val()) + " " + "08:00:00";
				etime = getCurrentMonthLast($("#startTime2").val()) + " " + "08:00:00";
				break;

			case "year":
				if($("#startTime3").val().trim() == "") {
					shalert("日期不能为空！");
					return false;
				}
				stime = $("#startTime3").val() + "-01-01 08:00:00";
				etime = $("#startTime3").val() + "-12-31 08:00:00";
				break;
			default:
				stime = $("#startTime1").val();
				etime = $("#endTime1").val();
				break;
		}

		var DataST = new Date(stime.replace(/-/g, '/'));
		var DateS = new Date(DataST);

		var DateEN = new Date(etime.replace(/-/g, '/'));
		var DateE = new Date(DateEN);

		$("#ss1").addClass("imgstyle");
		$("#ss1").html('<img src="../img/default.gif">');
		var jsStr = "Report {\"name\":\"" + pName + "\",\"start\":\"" + stime + "\",\"end\":\"" + etime + "\"}";

		send(jsStr);

	});

	/*导出execl*/
	$("#btnOutputExcel").on("click", function() {
		var rurl = $("link[rel=File-List]").attr("href").split('_');
		fileName1 = rurl[0] + "_" + rurl[1] + ".xls";
		var jsStr = "DownLoadFile {\"filename\":\"" + "ReportFile/" + fileName1 + "\"}";
		send(jsStr);

	});
	/*导出pdf*/
	$("#btnOutputPdf").on("click", function() {
		var rurl = $("link[rel=File-List]").attr("href").split('_');
		fileName1 = rurl[0] + "_" + rurl[1] + ".pdf";
		var jsStr = "DownLoadFile {\"filename\":\"" + "ReportFile/" + fileName1 + "\"}";
		send(jsStr);

	});
});

//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}
}

//收到消息
socket.onmessage = function(msg) {
	var result = msg.data;
	
	if(typeof result == "string") {
		var num = result.indexOf("exception");
		if(num > 0) {
			shalert("未找到文件");
			$("#ss1").attr("style", "height: 650px");
			$("#ss1").removeClass("imgstyle");
			$('#ss1 img').remove();
			var spread = new GcSpread.Sheets.Spread(document.getElementById('ss1'), {
				sheetCount: 1
			});
			return false;
		} else {
			if(result == "\{\"Function\":\"Login\",\"info\":\"执行成功。\"}") //初始化的时候返回的
			{
				/*显示excel*/
				$("#ss1").attr("style", "height: 650px");
				$("#ss1").removeClass("imgstyle");
				var spread = new GcSpread.Sheets.Spread(document.getElementById('ss1'), {
					sheetCount: 1
				});

			} else {
				//try {
				$("#ss1").attr("style", "");
				$("#ss1").removeClass("imgstyle");
				$("#ss1").html(result);
				/*} catch(e) {
					shalert(result);
					$("#ss1").attr("style", "height: 650px");
					var spread = new GcSpread.Sheets.Spread(document.getElementById('ss1'), {
						sheetCount: 1
					});
					
				}*/

			}
		}
	} else {
		try {
			var blob = new Blob([msg.data], {
					type: "applicationnd.ms-excel"
				}),
				fileName = fileName1;
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = fileName;
			link.click();
			window.URL.revokeObjectURL(link.href);
		} catch(e) {
			shalert("导出时出现问题，请联系管理员");
			return false;
		}
	}

}

//连接断开
socket.onclose = function(event) {
	/*console.log("Socket状态:" + readyStatus[socket.readyState]);*/
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