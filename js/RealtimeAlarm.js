
var RealTimeAlarmData;

$(document).ready(function() {
/*二维码的点击事件*/
	$("#QRcode").on("click",function(){
	
		$("#div_QRcode").toggle("slow");
	});

	/*	固定表头*/
	$("#tblList").freezeHeader();
	
	/*全选 反选 模拟量*/
	$("#checkAll").click(
		function() {

			if(this.checked) {

				$("input[name='check_table']").prop('checked', true);

			} else {
				$("input[name='check_table']").prop('checked', false);
			}
		}
	);
	
	/*查询按钮点击事件*/
	$("#btnQuery").click(function() {
		
		/*报表名称*/
		var pUsername = $.cookie("user");

		/*开始日期*/
		var pStime = $("#startTime").val().trim();

		/*结束日期*/
		var pEtime = $("#endTime").val().trim();

		var jsStr = "CheckRealTimeAlarmInfo {\"username\":\"" + pUsername + "\",\"startTime\":\"" + pStime + "\",\"endTime\":\"" + pEtime + "\"}";
		console.log(jsStr);
		send(jsStr);

	});
	
	
});
	
/*获取模拟量集合*/
function bindTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			// 结束时间
			var pEndTime = data["EndTime"] == null ? "" : data["EndTime"];
			
			if(data["Severity"] == "高高报")
			{
				str += "<tr class='fontred' role='row'>";
			}
			else if(data["Severity"] == "高报")
			{
				str += "<tr class='fontblue' role='row'>";
			}
			else if(data["Severity"] == "低报")
			{
				str += "<tr class='fontviolet' role='row'>";
			}
			else if(data["Severity"] == "低低报")
			{
				str += "<tr class='fontgreen' role='row'>";
			}
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + index + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td>" + data["TagName"]   + "</td>";
			str += "<td>" + data["Description"] + "</td>";
			str += "<td>" + data["Severity"] + "</td>";
			str += "<td>" + data["StartTime"] + "</td>";
			str += "<td>" + pEndTime + "</td>";
			str += "<td>" + data["AlarmValue"] + "</td>";
			str += "<td>" + data["AlarmStandard"] + "</td>";
			str += "<td>";
			str += "<button type='button' class='btn btn1 btn-success btnConfirmAlarm'   data-value='"+data["AlarmID"]+"'>";
			str +="<span>确认报警</span>"			                
			str +="</button></td>"
			str += "</tr>";
		});
	}

	return str;
}	

// 确认按钮点击事件
function ConfirmAlarmData(pAlarmID)
{
	var jsStr = "ConfirmOneAlarmTagInfo {\"id\":\"" + pAlarmID + "\"}";
	console.log(jsStr);
	send(jsStr);
}

	//连接成功
	socket.onopen = function() {
		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}

		send("RealTimeAlarmInfo {\"username\":\"" + $.cookie("user") + "\"}");
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
				case "RealTimeAlarmInfo":
					RealTimeAlarmData = result["data"]
					console.log(result["data"]);					
					$("tbody").html(bindTable(result["data"]));		
	                 
	                 /*确认报警按钮点击事件*/
					$(".btnConfirmAlarm").click(function() {
						var pAlarmID = this.getAttribute("data-value");
						console.log(pAlarmID);
						ConfirmAlarmData(pAlarmID);
					});
					break;
					
				case "CheckRealTimeAlarmInfo":
					console.log(result["data"]);					
					$("tbody").html(bindTable(result["data"]));	
					
					/*确认报警按钮点击事件*/
					$(".btnConfirmAlarm").click(function() {
						var pAlarmID = this.getAttribute("data-value");
						console.log(pAlarmID);
						ConfirmAlarmData(pAlarmID);
					});
					
					break;
				case "ConfirmOneAlarmTagInfo":
					shalert("确认成功");
					break;	
			}
		}
	}
	
//连接断开
socket.onclose = function(event) {
	console.log("Socket状态:" + readyStatus[socket.readyState]);
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