/*编辑区域的高度begin*/
/*屏幕高度*/
var pFrameHeight = $(window).height();

/*title的高度*/
var pTitleHeight = $(".portlet-title").height();

/*查询条件高度*/
var pConditionHeight = $("#div_condition").height();
/*end-----------------------------------------------*/
/*获得Url参数值*/
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);

	if(r != null) return unescape(r[2]);
	return null;
}

var pType=getQueryString("type");

/*页面title赋值*/
var ptitle = getQueryString("path").split(",");

for(var i = 0; i < ptitle.length; i++) {
	var option = $('<span></span>').html(ptitle[i]);
	option.appendTo($("#divTitle"));

	if(i < ptitle.length - 1) {
		$("#divTitle").append("<span>-</span>");
	}
}
/*begin判断浏览器*/
var u = navigator.userAgent;

if(u.indexOf('iPhone') > -1) { //苹果手机
	

	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
		if(window.orientation === 180 || window.orientation === 0) {
			var width=window.screen.width;
		
			$(".rowcolor").css("width",width);//.width(height);
		}
		if(window.orientation === 90 || window.orientation === -90) {
			
			var height=window.screen.height;
			$(".rowcolor").css("width",height);//.width("550px");

		}
	}, false);
}
/*end----------------------------------------*/
/*begin时间*/
function formatTen(num) {
	return num > 9 ? (num + "") : ("0" + num);
}

function formatDate(date, type) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	if(type == 1) {
		return year + "-" + formatTen(month) + "-" + formatTen(day) + " " + formatTen(hour) + "：" + formatTen(minute) + "：" + formatTen(second);
	} else {
		return year + "-" + formatTen(month) + "-" + formatTen(day);
	}

}

	/*全选 反选 */
	function checkAll(CheckClick,checkName)
	{
		$(CheckClick).click(
		function() {
			if(this.checked) {
				$("input[name='"+checkName+"']").prop('checked', true);
			} else {
				$("input[name='"+checkName+"']").prop('checked', false);
			}
		}
	);
	}
	/*单选全部选中后，全选按钮选中*/
	function radioAll(checkAll,checkName)
	{
		var $check = $("input[name='"+checkName+"']:checked");
			var ototal = $check.length;

			if($("input[name='"+checkName+"']").length == ototal) {
				$(checkAll).prop("checked", true);
			} else {
				$(checkAll).prop("checked", false);
			}
	}
	
