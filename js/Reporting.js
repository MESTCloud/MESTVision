$(function() {
	/*日历控件响应*/
	switch(pType) {
		case "day":
			$("#divday").show();
			$("#divmonth").hide();
			$("#divyear").hide();
			break;
		case "month":
			$("#divmonth").show();
			$("#divday").hide();
			$("#divyear").hide();
			break;
		case "year":
			$("#divyear").show();
			$("#divday").hide();
			$("#divmonth").hide();
			break;
		default:
			$("#divday").show();
			$("#divmonth").hide();
			$("#divyear").hide();
			break;
	}

	/*显示excel*/
	var spread = new GcSpread.Sheets.Spread(document.getElementById('ss'), {
		sheetCount: 1
	});

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
		
		console.log(stime);
		console.log(etime);

		var DataST = new Date(stime.replace(/-/g, '/'));
		var DateS = new Date(DataST);

		var DateEN = new Date(etime.replace(/-/g, '/'));
		var DateE = new Date(DateEN);

		console.log(DateS);
		console.log(DateE);

		var jsStr = "Report {\"name\":\"" + pName + "\",\"start\":\"" + stime + "\",\"end\":\"" + etime + "\"}";
		console.log(jsStr);
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

	result = JSON.parse(result);
	if(result["error"]) {
		shalert(result["error"]);
	} else if(result["exception"]) {
		shalert(result["exception"]);
	} else {
		switch(result["Function"]) {
			case "Report":
				console.log(result["data"])
				break;
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