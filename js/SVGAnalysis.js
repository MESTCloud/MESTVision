
$(function() {

	/*获得数据*/
	if(getQueryString("name")) {
		$("#SVGBox").append("<embed id='ShowSVG' src='" + "../ProcessWatching/" + getQueryString("name") + ".svg" + "' type='image/svg+xml' width='100%' />");
	}

	/*放大按钮点击事件*/
	$("#user_Enlarge").click(
		function() {
			var svg = document.getElementById("ShowSVG");
			svg.setAttribute("width", parseInt(parseInt(svg.getAttribute("width").substring(0, svg.getAttribute("width").length - 1)) + 10) + "%");
		}
	);

	/*缩小按钮点击事件*/
	$("#user_Narrow").click(
		function() {
			var svg = document.getElementById("ShowSVG");
			svg.setAttribute("width", parseInt(parseInt(svg.getAttribute("width").substring(0, svg.getAttribute("width").length - 1)) - 10) + "%");
		}
	);

	/*还原按钮点击事件*/
	$("#user_Return").click(
		function() {
			var svg = document.getElementById("ShowSVG");
			svg.setAttribute("width", "100%");
			svg.setAttribute("height", "100%");
		}
	);
	/*二维码的点击事件*/
	$("#QRcode").on("click",function(){
		var pbody=window.parent.document.body;/*获得父页面的body*/
		
		var urlstr="http://www.proficyrtoi.com:82/Cloud/"+$(pbody).find("iframe").attr("src").split('&')[0];
		var str= "BarCode {\"url\":\"" + urlstr +"\"}";
		send(str);
		
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
			case "BarCode":
			$("#QRcodeImg").attr("src","data:image/png;base64,"+result["info"]);
			$("#div_QRcode").toggle("slow");
			break;
		}

	}
}

//连接断开
socket.onclose = function(event) {
	//console.log("Socket状态:" + readyStatus[socket.readyState]);
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