
$(function () {		
	/*获得数据*/
	if (getQueryString("name")) {
        $("#SVGBox").append("<embed id='ShowSVG' src='" + "../img/" + getQueryString("name") + ".svg" + "' type='image/svg+xml' width='100%' />");
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
        	//console.log(svg.src);
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