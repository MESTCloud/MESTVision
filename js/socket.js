
		//全局Socket对象
		var socket;
		var readyStatus = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
		var host = "ws:/36.110.66.3:3000";
 	//尝试连接至服务器
	try {
		socket = new WebSocket(host);
	} catch(exception) {
		shalert("对不起，您所使用的浏览器不支持WebSocket.");
	}
		//发送
	function send(msg) {
		socket.send(msg);
	}
		//连接断开
	socket.onclose = function(event) {
		console.log("Socket状态:" + readyStatus[socket.readyState]);
		//location.href = "http://www.baidu.com";
	}
	//断开连接
	function disconnect() {
		socket.close();
	}