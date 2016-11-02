var RealTimeAlarmData;
var fileName1;

$(document).ready(function() {
	/*设置自适应滚动条*/
	$("#divtable").css("height", pFrameHeight-pTitleHeight-pConditionHeight-30);

	/*查询按钮点击事件*/
	$("#btn_check").click(function() {

		/*报表名称*/
		var pUsername = $.cookie("user");

		/*开始日期*/
		var pStime = $("#startTime").val();

		/*结束日期*/
		var pEtime = $("#endTime").val();
		/*判定事件*/
		if(pStime == "" || pStime == null) {
			shalert("开始时间不能为空！");
			return false;
		}
		if(pEtime == "" || pEtime == null) {
			shalert("结束时间不能为空！");
			return false;
		}
		if(pStime != "" && pEtime != "" && pStime > pEtime) {
			shalert("结束日期不能大于开始日期！");
			return false;
		}
		var jsStr = "CheckHisAlarmInfo {\"username\":\"" + pUsername + "\",\"startTime\":\"" + pStime + "\",\"endTime\":\"" + pEtime + "\"}";

		send(jsStr);

	});
	/*导出功能*/
	$("#btnOutputExcel").click(function() {
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

		var jsStr = "OutputHisAlarmInfo {\"username\":\"" + $.cookie("user") + "\",\"startTime\":\"" + pStime + "\",\"endTime\":\"" + pEtime + "\"}";

		send(jsStr);
	});
});

/*获取数据集合*/
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
			str += "<td>" + data["TagName"] + "</td>";
			str += "<td>" + data["Description"] + "</td>";
			str += "<td>" + data["Severity"] + "</td>";
			str += "<td>" + data["StartTime"] + "</td>";
			str += "<td>" + pEndTime + "</td>";
			str += "<td>" + data["AckTime"] + "</td>";
			str += "<td>" + data["AlarmValue"] + "</td>";
			str += "<td>" + data["AlarmStandard"] + "</td>";

			str += "</tr>";
		});
	}

	return str;
}
//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}

	send("HisAlarmInfo {\"username\":\"" + $.cookie("user") + "\"}");
}

//收到消息
socket.onmessage = function(msg) {
	var result = msg.data;
	if(typeof result == "string") {
		result = JSON.parse(result);
		if(result["error"]) {
			shalert(result["error"]);
		}
		/*else if(result["exception"]) {
			shalert(result["exception"]);
		} */
		else {
			switch(result["Function"]) {
				case "HisAlarmInfo":
					if(result["data"].length == 0) {
						shalert("查无资料");
					}
					$("tbody").html(bindTable(result["data"]));
					break;

				case "CheckHisAlarmInfo":
					if(result["data"].length == 0) {
						shalert("查无资料");
					}
					$("tbody").html(bindTable(result["data"]));

					break;
				case "OutputHisAlarmInfo":

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
			/*link.href = window.URL.createObjectURL(blob);*/
			link.href = window.URL.createObjectURL(blob);
			alert(1);
			//alert(link.href);
			link.download = fileName;
			link.click();
			window.URL.revokeObjectURL(link.href);
		} catch(e) {
			shalert("导出时出现问题，请联系管理员");
			return false;
		}
	}

}

/*function setImagePreview() {
	var docObj = document.getElementById("ctl00_ContentMain_file_head");
	var fileName = docObj.value;
	if(!fileName.match(/.jpg|.gif|.png|.bmp/i)) {
		alert('您上传的图片格式不正确，请重新选择！');
		return false;
	}
	var imgObjPreview = document.getElementById("preview");
	if(docObj.files && docObj.files[0]) { //火狐下，直接设img属性
		imgObjPreview.style.display = 'block';
		imgObjPreview.style.width = '63px';
		imgObjPreview.style.height = '63px';//imgObjPreview.src = docObj.files[0].getAsDataURL();
		if (window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1) 
		{
			imgObjPreview.src = window.webkitURL.createObjectURL(docObj.files[0]);
		}
		else {
			imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
		}
		
	} 
	else 
	{
		//IE下，使用滤镜
		docObj.select();
		docObj.blur();
		var imgSrc = document.selection.createRange().text;
		var localImagId = document.getElementById("localImag");
		//必须设置初始大小
		localImagId.style.width = "63px";
		localImagId.style.height = "63px";
		//图片异常的捕捉，防止用户修改后缀来伪造图片
		try 
		{
			localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		} 
		catch (e) 
		{
			alert("您上传的图片格式不正确，请重新选择！");
			return false;
		}
		imgObjPreview.style.display = 'none';document.selection.empty();
	}
	return true;
}*/

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