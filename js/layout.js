/*获得Url参数值*/
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);

	if(r != null) return unescape(r[2]);
	return null;
}

//var pType=getQueryString("type");
var pType = "day";

/*页面title赋值*/
var ptitle = getQueryString("path").split(",");

for(var i = 0; i < ptitle.length; i++) {
	var option = $('<span></span>').html(ptitle[i]);
	option.appendTo($("#divTitle"));

	if(i < ptitle.length - 1) {
		$("#divTitle").append("<span>-</span>");
	}
}
var u = navigator.userAgent;
		
if(u.indexOf('iPhone') > -1) { //苹果手机
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
		if(window.orientation === 180 || window.orientation === 0) {
			/*  alert('竖屏状态！');  */
			$(".rowcolor").width("320px");
		}
		if(window.orientation === 90 || window.orientation === -90) {
			/*alert('横屏状态！');*/
			$(".rowcolor").width("550px");
			
		}
	}, false);
}


