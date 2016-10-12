$(document).ready(function() {

	/*	固定表头*/
	$("#tblList").freezeHeader();
	
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
				case "UserList":
	
					UserData = result["data"]
					$("tbody").html(bindTable(result["data"]));
					
					break;
			}
		}
	}

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
				str += "<td style='word-break: break-all; word-wrap:break-word;'>" + data["UserName"] + "</td>";
				str += "<td>" + data["RealName"] + "</td>";
				str += "<td>" + data["Mobile"] + "</td>";
				str += "<td>" + data["RoleName"] + "</td>";
				str += "</tr>";
	
			});
		}
	
		return str;
	}

})