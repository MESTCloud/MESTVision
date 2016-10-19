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
	$("#QRcode").on("click", function() {
		var pbody = window.parent.document.body; /*获得父页面的body*/

		var urlstr = "http://www.proficyrtoi.com:82/Cloud/" + $(pbody).find("iframe").attr("src").split('&')[0];
		var str = "BarCode {\"url\":\"" + urlstr + "\"}";
		send(str);

	});

});

function WriteFloatValue(tag) {


	$("#Dialog").attr("style", "height:150px; width: 250px; position: absolute; left: 50%; top: 50%; margin-left: -125px; margin-top:-75px; z-index: 1000; background-color: #fff;")
	var content = "<div class='d_title'>&nbsp;<b>写入数据:</b>" + tag + "</div><div style='width:250px; text-align:center;' id='myForm'>" +
		"<div class='formDialogLayout'>" +
		"<label for='inputValue'>写入值：</label>" +
		"<input type='text' id='inputValue'>" +
		"</div>" +
		"<div style='text-align:center; margin-top:20px'>" +
		"<button id='yesFormWriteFloatButton'>提交</button>" +
		"<button id='noFormWriteFloatButton'>取消</button>" +
		"</div>" +
		"</div>";
		 
	$("#Dialog").html(content);
	$("#bg_Dialog").show();
	$("#Dialog").show();
	$("#yesFormWriteFloatButton").on("click", function() {
		var inputval = $("#inputValue").val();
		if(inputval == "" || inputval == null) {
			shalert("请写入正确值");
			$("#inputValue").focus();
			return false;
		} else {
			//var reg=/^[0-9]*\.?[0-9]*}$/;
			var reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
			if(!reg.test(inputval)) {
				$("#inputValue").val("");
				shalert("请写入数字，小数点后最多保留两位小数！");
				$("#inputValue").focus();
				return false;
			}
		}
		var strjson = "OPCWriteValue {\"tagName\":\"" + tag + "\",\"Value\":\"" + inputval + "\"}";
		send(strjson);
	});
	$("#noFormWriteFloatButton").on("click", function() {
		$("#bg_Dialog").hide();
		$("#Dialog").hide();
	});
	

}

function WriteBoolValue(tag) {

	 $("#Dialog").attr("style", "height:100px; width: 200px; position: absolute; left: 50%; top: 50%; margin-left: -100px; margin-top:-50px; z-index: 1000; background-color: #fff;")
	var content = "<div class='d_title'>&nbsp;开关量:" + tag + "<div type='button' id='close' class='btn btn-default pull-right btn-sm transparent'><i class='fa fa-times'></i></div></div><div style='text-align:center; width:160px; height:50px;'>" +
		"<button id='yesFormWrite' >开</button>" +
		"<button id='noFormWrite' >关</button>" +
		"</div>";
	$("#Dialog").html(content);
	$("#bg_Dialog").show();
	$("#Dialog").show();
    $("#close").click(function(){
    $("#bg_Dialog").hide();
	$("#Dialog").hide();
});
	var writeval;
	$("#yesFormWrite").on("click", function() {
		writeval = "1";
		var strjson = "OPCWriteValue {\"tagName\":\"" + tag + "\",\"Value\":\"" + writeval + "\"}";
		send(strjson);

	});
	$("#noFormWrite").on("click", function() {
		writeval = "0";
		var strjson = "OPCWriteValue {\"tagName\":\"" + tag + "\",\"Value\":\"" + writeval + "\"}";
		send(strjson);
	});

	/*  require(["dojo/on",
        "dojo/request/xhr",
        "dijit/registry",
        "dijit/Dialog",
        "dijit/form/Button",
        "dijit/form/NumberSpinner"],
        function (on, xhr, registry, Dialog, NumberSpinner) {
            var title1 = "开关量["+ tag +"]";
            var content = "<div style='text-align:center; width:160px; height:50px;'>" +
                            "<button id='yesFormWriteFloatButton' data-dojo-type='dijit/form/Button'>开</button>" +
                            "<button id='noFormWriteFloatButton' data-dojo-type='dijit/form/Button'>关</button>" +
                        "</div>";

            var formWriteFloat = new Dialog({
                id: "formWriteFloat",
                title: title1,
                content: content,
                closable: true,
                onHide: function () {
                    this.destroyRecursive();
                }
            });

            formWriteFloat.startup();

            var yesButton = registry.byId("yesFormWriteFloatButton");
            var noButton = registry.byId("noFormWriteFloatButton");
            //若是点击确定按钮

            on(yesButton, "click", function (mouseEvent) {
                xhr.post("ServerCode/InputHandler.ashx?tag=" + tag + "&value=1", {
                    handleAs: "json",
                    preventCache: true
                }).then(function (data) {
                    if (data.error) {
                        console.log(data.error);
                    }
                }, function (error) {
                    console.log(error);
                    formWriteFloat.hide();
                });
                formWriteFloat.hide();
            });

            //若是点击取消按钮
            on(noButton, "click", function (mouseEvent) {
                xhr.post("ServerCode/InputHandler.ashx?tag=" + tag + "&value=0", {
                    handleAs: "json",
                    preventCache: true
                }).then(function (data) {
                    if (data.error) {
                        console.log(data.error);
                    }
                }, function (error) {
                    console.log(error);
                    formWriteFloat.hide();
                });
                formWriteFloat.hide();
            });

            formWriteFloat.show();
        });
*/
}

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
				$("#QRcodeImg").attr("src", "data:image/png;base64," + result["info"]);
				$("#div_QRcode").toggle("slow");
				break;
			case "OPCWriteValue":
				shalert(result["info"]);
				$("#bg_Dialog").hide();
				$("#Dialog").hide();
				break;
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