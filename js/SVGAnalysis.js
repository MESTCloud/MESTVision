
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
});