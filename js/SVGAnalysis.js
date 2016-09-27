
$(function () {		
	/*获得数据*/
	if (getQueryString("name")) {
		
		/*页面title赋值*/
		switch (getQueryString("name"))
		{
		case "AHHX_001":
			{
				$("#txt_title").html("预冷");
			}
			break;

		case "AHHX_002":
			{
				$("#txt_title").html("纯化");
			}
			break;
		case "AHHX_003":
			{
				$("#txt_title").html("膨胀机");
			}
			break;

		case "AHHX_004":
			{
				$("#txt_title").html("分馏塔");
			}
			break;
		case "AHHX_005":
		{
			$("#txt_title").html("压氧压氮");
		}
		break;
		case "AHHX_006":
		{
			$("#txt_title").html("空压机");
		}
		break;
	}
		
	    $("#SVGBox").append("<embed id='ShowSVG' src='" + "../ProcessWatching/" + getQueryString("name") + ".svg" + "' type='image/svg+xml' width='100%' />");
    }
	
	/*获得Url参数值*/
	function getQueryString(name) {
	  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	  var r = window.location.search.substr(1).match(reg);

	  if (r != null) return unescape(r[2]); return null;
	}
	
	/*放大按钮点击事件*/
	$("#user_Enlarge").click(
        function () {
        	var svg = document.getElementById("ShowSVG");
            svg.setAttribute("width", parseInt(parseInt(svg.getAttribute("width").substring(0, svg.getAttribute("width").length - 1)) + 10) + "%");
        }
    );
    
    /*缩小按钮点击事件*/
	$("#user_Narrow").click(
        function () {
        	var svg = document.getElementById("ShowSVG");
            svg.setAttribute("width", parseInt(parseInt(svg.getAttribute("width").substring(0, svg.getAttribute("width").length - 1)) - 10) + "%");
        }
    );
    
    /*还原按钮点击事件*/
	$("#user_Return").click(
        function () {
        	var svg = document.getElementById("ShowSVG");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
        }
    );
});