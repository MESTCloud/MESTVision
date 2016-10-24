
//全局realtimeSocket对象
var realtimeSocket;

//尝试连接至服务器
try {
    realtimeSocket = new WebSocket("ws://36.110.66.3:29001");
} catch (exception) {
    shalert("对不起，您所使用的浏览器不支持WebSocket.");
}

// 页面加载
$(document).ready(function() {
	
	// 刷新周期下拉选单change事件
	$("#select_Refrash").change(function() {
	
	// 刷新秒数
	var pRefrash = $("#select_Refrash").val();
	realtimeSocket.send("{\"username\":\"" + $.cookie("user") + "\",\"updatetime\":\"" + pRefrash + "\"}");
	});	
});
/*获取table集合*/
function bindTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
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
			str += "<button type='button' class='btn btn1 btn-success btnConfirmAlarm'   data-value='" + data["AlarmID"] + "'>";
			str += "<span>确认报警</span>"
			str += "</button></td>"
			str += "</tr>";
		});
	}

	return str;
}

//连接成功
realtimeSocket.onopen = function () {
	
	// 发送消息
   realtimeSocket.send("{\"username\":\"" + $.cookie("user") + "\",\"updatetime\":\"" + "1000" + "\"}");
}

//收到消息
realtimeSocket.onmessage = function (msg) {
    var result = msg.data;
    result = JSON.parse(result);
    if (result["error"]) {
        shalert(result["error"]);
    } else if (result["exception"]) {
        shalert(result["exception"]);
    } else {
        switch (result["Function"]) {
            case "RealTimeAlarmInfo":
                
                $("tbody").html(bindTable(result["data"]));
                
                // 刷新后去掉checkbox勾选
                $("#checkAll").prop("checked", false);
                
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
            
        }
    }
}

//连接断开
realtimeSocket.onclose = function (event) {
    console.log("Socket状态:" + readyStatus[realtimeSocket.readyState]);
    window.parent.location.href = "../Login.html";
}

//断开连接
function disconnect() {
    realtimeSocket.close();
}