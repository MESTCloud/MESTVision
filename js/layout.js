
	/*获得Url参数值*/
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
         
		if(r != null) return unescape(r[2]);
		return null;
	}
	
	//var pType=getQueryString("type");
	var pType="day";
	
	/*页面title赋值*/
	var ptitle = getQueryString("path").split(",");

	for(var i = 0; i < ptitle.length; i++) {
	var option = $('<span></span>').html(ptitle[i]);
		option.appendTo($("#divTitle"));

		if(i < ptitle.length - 1) {
			$("#divTitle").append("<span>-</span>");
		}
	}