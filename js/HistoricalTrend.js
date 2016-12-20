/*查询*/
var tagList = [];
/*模拟笔组集合 在选择笔组后保存到tagGropList*/
var tagGropList = [];
var colorid = 0;
var strokeGroupList = [];
var colorArray = [
	'#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
	'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
	'#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
	'#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0',
	'#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
	'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'
]; /*颜色初始化*/
var timeTicket; /*定时器*/
var trId = ""; /*存放点击id*/
var colorItem = 0; /*存储颜色id*/
var height = pFrameHeight - pTitleHeight - 30;
//$(".div1").css("height", height - 180);
$("#Dialog").css("height", height - 50);
$(".rhTrendright").css("height", height);
$(".rhTrendright_right").css("height", height);
/*$(".rhTrendright_top_top").css("height", "120px");*/
$(".rhTrendright_top_top").css("height", height * 0.12);
$(".rhTrendright_middle").css("height", height * 0.7);
$("#echarts_line").css("height", height * 0.66);

$(".rhTrendright_bottom").css("height", height * 0.23);
$(".rhTrendright_right_top").css("height", height);
var leftheight = $(".rhTrendleftTitle").height();
//$(".div1 .portlet-body").css("height", height - leftheight);
var tags = new Array();
jQuery(document).ready(function() {
	/*采集周期默认值*/
	$("#cycleType").val("2")

	/*判定点击的此行是否已经存在*/
	function isExist(id) {
		var boolE = true;

		$.each(tagGropList, function(index, data) {

			if("tagGrop" + data["ID"] == id) {
				boolE = false;
			}

		});

		return boolE;
	}

	//function(ec) {
	//时间初始化
	var sDate = new Date();
	$("#startTime").val(formatDate(sDate, 0) + " 08：00：00");
	$("#endTime").val(formatDate(sDate, 1));
	// --- LINE ---
	var myChart1;
	var myChart2;
	var myChart3;
	var myChart;
	var option;
	chart();

	function chart() {
		myChart = echarts.init(document.getElementById('echarts_line'));
		option = {

			tooltip: {
				trigger: 'axis'
			},

			dataZoom: [{
				show: true,
				/*x: 'center',*/

			}, {
				type: 'inside'
			}],
			legend: {
				data: ['High', 'Low'],
				/* x: 'center',
             y: '360px',*/

			},
			grid: [{
				containLabel: true,

				left: 60,
				right: 80

			}, {

				left: 60,
				right: 80,
				top: '55%',

				containLabel: true

			}],
			toolbox: {
				show: true,
				feature: {

					mark: {
						show: false
					},
					dataView: {
						show: false,
						readOnly: false
					},

					magicType: {
						title: {
							line: '折线图',
							bar: '柱形图'
						},
						show: true,
						type: ['line', 'bar'],
						right: '20%'

					},
					restore: {
						show: false
					},
					saveAsImage: {
						show: false
					}

				}
			},

			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: (function() {
					var now = new Date();
					var res = [];
					var len = 10;
					while(len--) {
						res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
						now = new Date(now - 2000);
					}
					return res;
				})()
			}],
			yAxis: [{
				type: 'value',
				scale: true,
				name: ''
			}],

			series: []
		};

		// 为echarts对象加载数据

		myChart.setOption(option);
		/*随浏览器的变化而变化*/
		window.onresize = function() {

			myChart.resize(); //使第一个图表适应

		}
	}

	/*笔组关联点的name值*/
	function realTag(tagGropList) {

		tags = [];
		$.each(tagGropList, function(index, data) {
			tags.push(data["Tagname"]);

		})
		return tags;
	}
	/*笔组关联点的name值*/
	function IDTag(tagGropList) {
		var id = [];
		$.each(tagGropList, function(index, data) {
			id.push(data["ID"]);

		})
		return id;
	}

	/*笔组关联点的颜色*/
	function ColorTag(tagGropList) {
		var color = [];

		$.each(tagGropList, function(index, data) {
			color.push(data["Color"]);

		})
		return color;
	}
	/*颜色配置关闭*/
	$("#btn_Color").on("click", function() {
		$(".rhTrendright_right").css('display', 'none');
		$(".rhTrendright").width("100%");
		btnTrend.resize();
	});
	var btnTrend;

	/*历史趋势点击*/
	function lineTreed() {
		chart();
		/*myChart1.clear();
		
		myChart2.clear();
		myChart3.clear();*/
		myChart1 = "";

		myChart2 = "";
		myChart3 = "";
		legendData = [];

		btnTrend = myChart;
		/*判断开始结束时间段的差，如果相差*/
		$("#echarts_line").css("display", "block");

		historyLineFunction();
		
		seriesData = [];
		

	}
	$("#btn_history").on('click', function() {

		lineTreed();
	});
	/*获取两个日期的时间差*/

	function GetDateDiff(startTime, endTime, diffType) {
		//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
		startTime = startTime.replace(/-/g, "/");
		endTime = endTime.replace(/-/g, "/");
		//将计算间隔类性字符转换为小写
		diffType = diffType.toLowerCase();
		var sTime = new Date(startTime); //开始时间
		var eTime = new Date(endTime); //结束时间
		//作为除数的数字
		var divNum = 1;
		switch(diffType) {
			case "second":
				divNum = 1000;
				break;
			case "minute":
				divNum = 1000 * 60;
				break;
			case "hour":
				divNum = 1000 * 3600;
				break;
			case "day":
				divNum = 1000 * 3600 * 24;
				break;
			default:
				break;
		}
		return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)); //
	}

	/*查询*/
	$("#bg_checkColl").on("click", function() {
		$("#myModalTend_Add tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
		var jsStr = "SelectTagList {\"name\":\"" + $("#input_name").val().trim() + "\"}";

		send(jsStr);

	});
	var xAxisData = new Array();
	var seriesData = new Array();
	var legendData = new Array();

	function historyLineFunction() {
		/*判定*/

		if(tagGropList.length == 0) {
			shalert("请选择标签！");

			myChart.clear();

			disabled_btn();
			return false;
		}

		tempNum = 0;
		btnTrend = myChart;

		btnTrend.showLoading({
			btnTrendtext: "图表数据正在努力加载..."
		});

		/*var tagGropList1=[];
		for(var i=0;i<tagGropList.length;i++)
		{
			if(tagGropList[i]['show']!="false"||tagGropList[i]['show']==undefined)
			{
				tagGropList1.push(tagGropList[i]);
			}
		}*/
		var tags = realTag(tagGropList);
		console.log(tagGropList);
		var start = $("#startTime").val().replace(/\：/g, ':');
		var end = $("#endTime").val().replace(/\：/g, ':');

		colorid = 0;
		//seriesData=[];
		/*	var hour = GetDateDiff(start, end, "hour");

			if(hour <= 1) //一小时之内的以1s查询 {
				
				$("#cycleValue").val("1");
				$("#cycleType").val("1");
				
			} else if(hour > 1 && hour <= 2)
			//两小时内的以半小时查询
			{
				
				$("#cycleValue").val("30");
				$("#cycleType").val("2");
				
			} else if(hour > 2 && hour <= 24)
			//一天之内的以2小时
			{
				
				$("#cycleValue").val("2");
				$("#cycleType").val("3");
			
			} else if(hour > 24 && hour <= 48)
			//两天之内的以4小时间隔
			{
			
				$("#cycleValue").val("4");
				$("#cycleType").val("3");
				
			} else if(hour > 48 && hour <= 31 * 24) { //一个月，以48小时间隔
			
				$("#cycleValue").val("48");
				$("#cycleType").val("3");
			
			} else if(hour >= 31 * 24 && hour < 31 * 24 * 3) { //三个月内，以1个月为间隔
			
				$("#cycleValue").val("1");
				$("#cycleType").val("4");
				
			} else if(hour >= 31 * 24 * 3 && hour < 31 * 24 * 6) { //6个月内，以2月为间隔
				
				$("#cycleValue").val("2");
				$("#cycleType").val("4");
			
			} else if(hour >= 31 * 24 * 6 && hour < 31 * 24 * 12) {
				//12个月内，以4月为间隔
			
				$("#cycleValue").val("4");
				$("#cycleType").val("4");
			
			} else {
				
				$("#cycleValue").val("1");
				$("#cycleType").val("2");
				
			}*/
		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		var cvalue = $("#cycleValue").val();

		var ctyle = $("#cycleType").val();
		if(ctyle == "4") {
			cvalue = cvalue * 30 * 24;
			ctyle = "3";
		}

		for(var i = 0; i < tags.length; i++) {

			var jsStr = "GetHistoryData {\"tags\":\"" + tags[i] + "\",\"start\":\"" + start + "\",\"end\":\"" + end + "\",\"cvalue\":\"" + cvalue + "\",\"ctype\":\"" + ctyle + "\"}";
			send(jsStr);
		}

	}

	/*前进*/
	$("#btnGo").on("click", function() {
			colorid = 0;
			seriesData = [];
			$("#btnToday").attr("disabled", true);
			$("#btnMonth").attr("disabled", true);
			$("#btnMonth_3").attr("disabled", true);
			$("#btnMonth_6").attr("disabled", true);
			$("#btnYear").attr("disabled", true);
			//$("#btnGo").attr("disabled", true);
			$("#btnBack").attr("disabled", true);
			var st = new Date($("#startTime").val().replace(/\：/g, ':'));
			var et = new Date($("#endTime").val().replace(/\：/g, ':'));
			var cDate = et.getTime() - st.getTime();
			var stDate = new Date(st.getTime() + cDate);
			var etDate = new Date(et.getTime() + cDate);
			$("#startTime").val(formatDate(stDate, 1));
			$("#endTime").val(formatDate(etDate, 1));
			historyLineFunction();

		})
		/*后退*/
	$("#btnBack").on("click", function() {
			colorid = 0;
			seriesData = [];
			$("#btnToday").attr("disabled", true);
			$("#btnMonth").attr("disabled", true);
			$("#btnMonth_3").attr("disabled", true);
			$("#btnMonth_6").attr("disabled", true);
			$("#btnYear").attr("disabled", true);
			$("#btnGo").attr("disabled", true);
			//$("#btnBack").attr("disabled", true);
			var st = new Date($("#startTime").val().replace(/\：/g, ':'));
			var et = new Date($("#endTime").val().replace(/\：/g, ':'));
			var cDate = et.getTime() - st.getTime();
			var stDate = new Date(st.getTime() - cDate);
			var etDate = new Date(et.getTime() - cDate);
			$("#startTime").val(formatDate(stDate, 1));
			$("#endTime").val(formatDate(etDate, 1));
			historyLineFunction();
		})
		/*自定义查询*/
	$("#btn_select").on("click", function() {
	
		$("#btnWeek").attr("disabled", true);
		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);

		$("#btnYesterMonth").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);

		$("#btnToday").attr("disabled", true);

		/*var start = $("#startTime").val().replace(/\：/g, ':');
				var end = $("#endTime").val().replace(/\：/g, ':');
				var cvalue = $("#cycleValue").val().trim();
				var ctyle = $("#cycleType").val().trim();*/
		lineTreed();
	});
	/*今天*/
	$("#btnToday").on("click", function() {
		$("#echarts_line").css("display", "block");

		colorid = 0;
		seriesData = [];
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);

		$("#btnYesterMonth").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);

		$("#btn_select").attr("disabled", true);

		var sDate = new Date();

		$("#startTime").val(formatDate(sDate, 0).toString().split(' ')[0] + " 00：00：00");
		$("#endTime").val(formatDate(sDate, 0).toString().split(' ')[0] + " 23：59：59");
		$("#cycleValue").val("2");
		$("#cycleType").val("3");

		historyLineFunction();
	});
	//本月趋势
	$("#btnMonth").on("click", function() {
		colorid = 0;
		seriesData = [];
		$("#echarts_line").css("display", "block");

		$("#btnWeek").attr("disabled", true);
		$("#btnToday").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);

		$("#btnYesterWeek").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		var year = sDate.getFullYear();
		var month = sDate.getMonth() + 1;
		var day = new Date(year, month, 0);
		$("#startTime").val(year + '-' + month + '-01' + " 00：00：00");
		$("#endTime").val(year + '-' + month + '-' + day.getDate() + " 23：59：59");

		$("#cycleValue").val("48");
		$("#cycleType").val("3");
		historyLineFunction();
	});

	/*本周*/
	$("#btnWeek").on("click", function() {
		$("#echarts_line").css("display", "block");

		colorid = 0;
		seriesData = [];
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		$("#btnYesterWeek").attr("disabled", true);

		var now = new Date(); //当前日期 
		var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
		$("#startTime").val(formatDate(date, 1));

		$("#endTime").val(formatDate(sDate, 1));

		$("#btn_select").attr("disabled", true);
		$("#cycleValue").val("24");
		$("#cycleType").val("3");
		historyLineFunction();
	});
	/*三个月*/
	$("#btnMonth_3").on("click", function() {
		colorid = 0;
		seriesData = [];
		$("#echarts_line").css("display", "block");

		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		//$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);
		$("#btnYesterWeek").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		var year = sDate.getFullYear();
		var yeartay = sDate.getFullYear();
		var monthTay = sDate.getMonth() + 1;
		var month = sDate.getMonth() + 1 - 2;
		if(month == 0) {
			month = 12;
			year = year - 1;
		} else if(month == -1) {
			month = 11;
			year = year - 1;
		} else if(month == -2) {
			month = 10;
			year = year - 1;
		}
		if(month < 10) {
			month = "0" + month;
		}
		var day = new Date(year, month, 0);
		$("#startTime").val(year + '-' + month + '-01' + " 00：00：00");
		$("#endTime").val(yeartay + '-' + monthTay + '-' + day.getDate() + " 23：59：59");

		$("#cycleValue").val("1");
		$("#cycleType").val("4");

		historyLineFunction();
	});
	/*半年*/
	$("#btnMonth_6").on("click", function() {
		$("#echarts_line").css("display", "block");

		colorid = 0;
		seriesData = [];
		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		//$("#btnMonth_6").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);
		$("#btnYesterWeek").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		var year = sDate.getFullYear();
		var yeartay = sDate.getFullYear();
		var monthTay = sDate.getMonth() + 1;
		var month = sDate.getMonth() + 1 - 5;
		if(month == 0) {
			month = 12;
			year = year - 1;
		} else if(month == -1) {
			month = 11;
			year = year - 1;
		} else if(month == -2) {
			month = 10;
			year = year - 1;
		} else if(month == -3) {
			month = 09;
			year = year - 1;
		} else if(month == -4) {
			month = 08;
			year = year - 1;
		}
		if(month < 10) {
			month = "0" + month;
		}
		var day = new Date(year, month, 0);
		$("#startTime").val(year + '-' + month + '-01' + " 00：00：00");
		$("#endTime").val(yeartay + '-' + monthTay + '-' + day.getDate() + " 23：59：59");
		$("#cycleValue").val("2");
		$("#cycleType").val("4");

		historyLineFunction();
	});
	/*一年*/
	$("#btnYear").on("click", function() {
		$("#echarts_line").css("display", "block");

		colorid = 0;
		seriesData = [];
		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		//$("#btnYear").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);
		$("#btnYesterWeek").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		var year = sDate.getFullYear();

		$("#startTime").val(year + '-' + "01" + '-01' + " 00：00：00");
		$("#endTime").val(year + '-' + "12" + '-' + "31" + " 23：59：59");
		$("#cycleValue").val("4");
		$("#cycleType").val("4");

		historyLineFunction();
	});
	/*前一天*/
	$("#btnYesterday").on("click", function() {
		colorid = 0;
		seriesData = [];
		$("#echarts_line").css("display", "block");

		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);
		$("#btnYesterWeek").attr("disabled", true);
		//$("#btnYesterday").attr("disabled", true);
		$("#btnYesteryear").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		//var start = $("#startTime").val().toString();
		var start = new Date($("#startTime").val().replace(/\：/g, ':'));
		//var et = new Date($("#endTime").val().replace(/\：/g, ':'));

		start.setDate(start.getDate() - 1); //获取AddDayCount天后的日期
		var y = start.getFullYear();
		var m = start.getMonth() + 1; //获取当前月份的日期 
		var d = start.getDate();
		//var end = $("#startTime").val().toString();
		$("#startTime").val(y + "-" + m + "-" + d + " 00：00：00");
		$("#endTime").val(y + "-" + m + "-" + d + " 23：59：59");

		$("#cycleValue").val("2");
		$("#cycleType").val("3");

		historyLineFunction();
	});
	/*上一年*/
	$("#btnYesteryear").on("click", function() {
		colorid = 0;
		seriesData = [];
		$("#echarts_line").css("display", "block");

		$("#btnToday").attr("disabled", true);
		$("#btnMonth").attr("disabled", true);
		$("#btnMonth_3").attr("disabled", true);
		$("#btnMonth_6").attr("disabled", true);
		$("#btnYear").attr("disabled", true);
		$("#btnGo").attr("disabled", true);
		$("#btnYesterMonth").attr("disabled", true);
		$("#btnBack").attr("disabled", true);
		$("#btnYesterday").attr("disabled", true);
		$("#btnWeek").attr("disabled", true);
		$("#btnYesterWeek").attr("disabled", true);
		$("#btn_select").attr("disabled", true);
		//$("#btnYesteryear").attr("disabled", true);
		var start = new Date($("#startTime").val().replace(/\：/g, ':'));
		var y = start.getFullYear() - 1;

		$("#startTime").val(y + "-" + "01" + "-" + "01" + " 00：00：00");
		$("#endTime").val(y + "-" + "12" + "-" + "31" + " 23：59：59");

		$("#cycleValue").val("4");
		$("#cycleType").val("4");
		historyLineFunction();
	});
	/*全屏*/
	fullscreen();

	function fullscreen() {
		$("#btn_fullscreen").on("click", function() {
			

			if($("#btn_fullscreen").text().trim() == "全屏") {
				$("#btn_fullscreen").text("还原");
				$("#close_treed").css('display', 'block');

				$(".rhTrendright_bottom").css('display', 'none');
				$(".rhTrendright_middle").addClass("topboder");
				$(".rhTrendright_right").css('display', 'none');
				$(".bottom_title").css('display', 'none');
				$(".rhTrendright_top").css('display', 'none');
				$(".rhTrendright_top_top").css('display', 'none');
				$(".rhTrendright_middle").css("height", height);
				$("#echarts_line").css("height", height * 0.95);
			} else {
				$("#btn_fullscreen").text("全屏");
				$("#close_treed").css('display', 'none');
				$(".rhTrendright_middle").css("height", height * 0.7);
				$("#echarts_line").css("height", height * 0.66);

				$(".rhTrendright_middle").removeClass("topboder");
				$(".rhTrendright_bottom").css('display', 'block');
				$(".bottom_title").css('display', 'block');
				$(".rhTrendright_right").css('display', 'none');
				$(".rhTrendright_top").css('display', 'block');
				$(".rhTrendright_top_top").css('display', 'block');

			}
			myChart.resize();

		});

	}
	/*关闭全屏*/

	//close_treed();
	/*function close_treed()
	{
			$("#close_treed").on("click", function() {
		$("#close_treed").css('display', 'none');
		$(".rhTrendright_middle").css("height", height * 0.7);
		$("#echarts_line").css("height", height * 0.66);

		$(".rhTrendright_middle").removeClass("topboder");
		$(".rhTrendright_bottom").css('display', 'block');
		$(".bottom_title").css('display', 'block');
		$(".rhTrendright_right").css('display', 'none');
		$(".rhTrendright_top").css('display', 'block');
		$(".rhTrendright_top_top").css('display', 'block');

		myChart.resize();

	});
	}
*/
	/*保存笔组*/
	$("#btn_Savestrokegroup").click(function() {

		var strokeGroup = $("#input_strokegroup").val().trim();
		if(strokeGroup.trim() == "") {
			shalert("请填写笔组名称");
			return false;
		}
		var tagids = IDTag(tagGropList).join(',');
		var colors = ColorTag(tagGropList).join(',');
		if(!isStrokeGroup(strokeGroup)) {

			shconfirm("确定要覆盖原来的数据", function(result) {

				if(result) {

					var jsStr = "AddGroup {\"name\":\"" + strokeGroup + "\",\"ids\":\"" + tagids + "\",\"colors\":\"" + colors + "\"}";

					send(jsStr);
				}

			});
		} else {

			var jsStr = "AddGroup {\"name\":\"" + strokeGroup + "\",\"ids\":\"" + tagids + "\",\"colors\":\"" + colors + "\"}";
			send(jsStr);
		}
		groupName = $("#input_strokegroup").val();
	});
	/*判定此笔组是否已经存在*/
	function isStrokeGroup(strokeGroup) {
		var isStroke = true;
		$.each(strokeGroupList, function(index, data) {
			if(data["GroupName"] == strokeGroup) {
				isStroke = false;

			}
		});
		return isStroke;
	}
	//删除笔组\n
	/*		$("#btn_Delstrokegroup").click(function() {
				var strokeGroup = $("#input_strokegrouplist").val().trim();

				shconfirm("确定要删除此笔组？", function(result) {

					if(result) {
						var jsStr = "DeleteGroup {\"id\":\"" + strokeGroup + "\"}";

						send(jsStr);
					}

				});
			});*/
	//删除笔
	function deletegroup(trId) {

		if(trId != "") {
			if(tagGropList != null) {

				for(var i = 0; i < tagGropList.length; i++) {

					if(("tagGrop" + tagGropList[i]["ID"]) == trId) {

						tagGropList.splice(i, 1);
					}
				}

				$("#" + trId).remove();

			}
		} else {
			shalert("请选择要删除的笔")
		}
	}

	/*end*/

	/*颜色配置*/
	function Ccolor() {
		$(".Ccolor").on("click", function() {

			if($(".rhTrendright_right").is(":hidden")) {
				$(".rhTrendright").width("84%"); //如果元素为隐藏,则将它显现

				$(".rhTrendright_right").css('display', 'block');
			}
			if(btnTrend != undefined) {
				btnTrend.resize();
			}

		});

	}

	/*颜色版加载*/

	$('.demo').each(function() {

		$(this).minicolors({

			control: $(this).attr('data-control') || 'hue',
			defaultValue: $(this).attr('data-defaultValue') || '',
			inline: $(this).attr('data-inline') === 'true',
			letterCase: $(this).attr('data-letterCase') || 'lowercase',
			opacity: $(this).attr('data-opacity'),
			position: $(this).attr('data-position') || 'bottom left',
			change: function(hex, opacity) {

				if(!hex) return;
				if(opacity) hex += ', ' + opacity;
				if(typeof console === 'object') {

					if(trId != "") {
						$.each(tagGropList, function(index, data) {

							if(("tagGrop" + data["ID"]) == trId) {
								$(this)[0]["Color"] = hex;

							}
						});
						$(".rhTrendright_bottom tbody").html(tagGropListbind(tagGropList));
						bottomtr();
						//alert(2);
						Ccolor();
						showHide();
					}

				}
			},

			theme: 'bootstrap'
		});

	});
	if(!jQuery().colorpicker) {
		return;
	}
	$('.colorpicker-default').colorpicker({
		format: 'hex'
	});
	$('.colorpicker-rgba').colorpicker();
	/*导出趋势图中的信息*/
	/*$("#btn_out").on("click", function() {
		method1("ta");
	});*/
	var idTmr;

	function getExplorer() {

		var explorer = window.navigator.userAgent;

		//ie 

		if(explorer.indexOf("MSIE") >= 0) {

			return 'ie';

		}

		//firefox 
		else if(explorer.indexOf("Firefox") >= 0) {

			return 'Firefox';

		}

		//Chrome
		else if(explorer.indexOf("Chrome") >= 0) {

			return 'Chrome';

		}

		//Opera
		else if(explorer.indexOf("Opera") >= 0) {

			return 'Opera';

		}

		//Safari
		else if(explorer.indexOf("Safari") >= 0) {

			return 'Safari';

		}

	}

	function method1(tableid) { //整个表格拷贝到EXCEL中

		if(getExplorer() == 'ie')

		{

			var curTbl = document.getElementById(tableid);

			var oXL = new ActiveXObject("Excel.Application");

			//创建AX对象excel 

			var oWB = oXL.Workbooks.Add();

			//获取workbook对象 

			var xlsheet = oWB.Worksheets(1);

			//激活当前sheet 

			var sel = document.body.createTextRange();

			sel.moveToElementText(curTbl);

			//把表格中的内容移到TextRange中 

			sel.select();

			//全选TextRange中内容 

			sel.execCommand("Copy");

			//复制TextRange中内容  

			xlsheet.Paste();

			//粘贴到活动的EXCEL中       

			oXL.Visible = true;

			//设置excel可见属性

			try {

				var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");

			} catch(e) {

				print("Nested catch caught " + e);

			} finally {

				oWB.SaveAs(fname);

				oWB.Close(savechanges = false);

				//xls.visible = false;

				oXL.Quit();

				oXL = null;

				//结束excel进程，退出完成

				//window.setInterval("Cleanup();",1);

				idTmr = window.setInterval("Cleanup();", 1);

			}

		} else

		{

			tableToExcel('ta')

		}

	}

	function Cleanup() {

		window.clearInterval(idTmr);

		CollectGarbage();

	}

	var tableToExcel = (function() {

			var uri = 'data:application/vnd.ms-excel;base64,',

				template = '{table}',
				base64 = function(s) {
					return window.btoa((encodeURIComponent(s)))
				},

				format = function(s, c) {

					return s.replace(/{(\w+)}/g,

						function(m, p) {
							return c[p];
						})
				}

			return function(table, name) {

				if(!table.nodeType) table = document.getElementById(table)

				var ctx = {
					worksheet: name || 'Worksheet',
					table: table.innerHTML
				}

				window.location.href = uri + base64(format(template, ctx))

			}

		})()
		/*end----*/

	function tagListbind(datatable) {
		var str = "";

		if(datatable.length > 0) {

			$.each(datatable, function(index, data) {

				str += "<tr id=" + data["ID"] + "  data-index='" + index + "'>";
				str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
				str += "<input type='checkbox' class='checkboxes' id='" + data["ID"] + "' name='check_table' data-index='" + index + "'>";
				str += "<span></span>";
				str += "</label> </td>";
				str += "<td>" + data["Tagname"] + "</td>";
				str += "<td>" + data["Description"] + "</td>";
				str += "</tr>";
			});
		}

		return str;
	}

	/*tr 的点击事件*/
	function tagleftClick() {

		$("#myModalTend_Add tbody tr input").on("click", function() {
			var truey = $(this).find('input[name=check_table]').context.checked;
			$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style");
			if(truey) {
				
				if(isExist("tagGrop" + $(this).attr("ID"))) {
					/*页面动态加载*/

					[tagList[$(this).attr("data-index")]][0]["Color"] = colorArray[colorItem];
					$(".rhTrendright_bottom tbody").append(tagGropListbind([tagList[$(this).attr("data-index")]]));
                    $("#dele_this").removeAttr("data-id");
                    $("#dele_this").hide();
                    $("#dele_this_line").hide();
                    /*标签删除*/
					$(".delgrop").click(function() {
						var trId = "tagGrop" + $(this).attr("data-value");
						var groupname = $(this).attr("groupname");

						var tagName = $(this).parent().parent().find("td").eq(0).html();

						if(trId != "") {
							shconfirm("确定要删除吗？", function(result) {
								if(result) {
									/*alert(1)*/
									if(tagGropList != null) {
										for(var i = 0; i < tagGropList.length; i++) {
											if(("tagGrop" + tagGropList[i]["ID"]) == trId) {
												tagGropList.splice(i, 1);
											}
										}

										$("#" + trId).remove();
										
										if(tagGropList.length > 0) {

											for(var i = 0; i < seriesData.length; i++) {
												if(tagName == seriesData[i]["name"]) {
													seriesData.splice(i, 1);
													i--;
												}
											}
											
											if(xAxisData.length > 0) {
												myChart1 = echarts.init(document.getElementById('echarts_line'));
												var option = {

													tooltip: {
														trigger: 'axis'
													},
													legend: {
														data: ['High', 'Low']
													},
													dataZoom: [{
														show: true,

													}, {
														type: 'inside'
													}],
													grid: [{
														left: 80,
														right: 80,
														containLabel: true

													}, {
														left: 80,
														right: 80,
														top: '55%',
														containLabel: true

													}],
													toolbox: {
														show: true,
														feature: {

															mark: {
																show: false
															},
															dataView: {
																show: false,
																readOnly: false
															},
															dataZoom: [{
																show: true,

															}, {
																type: 'inside',

															}],
															magicType: {
																title: {
																	line: '折线图切换',
																	bar: '柱形图切换'
																},
																show: true,
																type: ['line', 'bar'],
																right: '20%'

															},
															restore: {
																show: false
															},
															saveAsImage: {
																show: false
															}

														}
													},

													xAxis: [{
														type: 'category',
														boundaryGap: false,
														data: xAxisData

													}],
													yAxis: [{
														type: 'value',
														scale: true,
														name: ''
													}],
													series: seriesData
												};

												// 为echarts对象加载数据
												myChart1.setOption(option);
												/*随浏览器的变化而变化*/
												window.onresize = function() {

														myChart1.resize(); //使第一个图表适应

													}
													/*获取图例*/
												legendData = [];
												for(var i = 0; i < seriesData.length; i++) {
													legendData.push(seriesData[i]["name"]);
												}

												option.series = seriesData;

												option.legend.data = legendData;
												myChart1.setOption(option);

											}

										} else if(tagGropList.length == 0) {

											$("#echarts_line").css("display", "none");

										}

										//shalert("删除成功！");
									}

									if(groupname != "" && groupname != undefined) {
										strokeGroup = groupname;

										var tagids = IDTag(tagGropList).join(',');
										var colors = ColorTag(tagGropList).join(',');

										var jsStr = "AddGroup {\"name\":\"" + strokeGroup + "\",\"ids\":\"" + tagids + "\",\"colors\":\"" + colors + "\"}";
										send(jsStr);

									}
								}
							});

						} else {
							shalert("请选择要删除的笔")
						}

					});

					bottomtr();
					Ccolor();
					showHide();
					/*if(tagGropList.length!=0)
					{
						alert();
						tagGropList=tagGropList;
					}*/
					tagGropList.push(tagList[$(this).attr("data-index")]);
					colorItem++;
				}

			} else {
				deletegroup("tagGrop" + $(this).attr("ID"))
			}

		});

	}

	/*笔组切换*/
	$("#input_strokegrouplist").on("change", function() {
		selectGroup();
	});
	var groupName;

	function selectGroup() {

		var jsStr = "SelectGroup {\"id\":\"" + $("#input_strokegrouplist").val().trim() + "\"}";
		groupName = $("#input_strokegrouplist").find("option:selected").text(); //$("#input_strokegrouplist").val().trim();
		send(jsStr);
	}
	/*删除笔组笔切换*/

	function deleteselectGroup() {

		var jsStr = "SelectGroup {\"id\":\"" + $("#delete_strokegrouplist").val().trim() + "\"}";
		groupName = $("#delete_strokegrouplist").find("option:selected").text(); //$("#input_strokegrouplist").val().trim();
		send(jsStr);
	}

	/*删除笔组*/
	/*$("#delete_strokegrouplist").on("change", function() {

			deleteselectGroup();

		}

	);*/

	/*选择笔组列表*/
	$("#btn_input").on("click", function() {
		//selectGroup();
		$("#myStrokegroup_List").modal('hide');
		lineTreed();
		if(tagGropList.length > 0) {

			$("#rhTrendright_bottom").show();
			$("#li_savegroup1").show();
			$("#li_savegroup2").show();
			$("#dele_this").show();
			$("#dele_this_line").show();
			var value = $("#input_strokegrouplist").val();
			$("#dele_this").attr("data-id", value);
		} else {

			$("#li_savegroup1").hide();
			$("#li_savegroup2").hide();
			$("#dele_this").hide();
			$("#dele_this_line").hide();
		}
		groupName = "";
		fullscreen();
		//close_treed();
	});
	/*删除当前笔组*/
	var  tempbtn="";//用来判定当前点击的删除当前笔组
	$("#dele_this").on("click", function() {
		tempbtn="1";
		var deletegroup = $(this).attr("data-id");
		
		shconfirm("确定要删除吗？", function(result) {
			if(result) {
				var jsStr = "DeleteGroup {\"id\":\"" + deletegroup + "\"}";

				send(jsStr);
				myChart.clear();
				tagGropList=[];
				$(".rhTrendright_bottom tbody tr").html("");
				
			}
		});
	});
	/*笔组加载*/
	function strokeGroupbind(datatable) {
		var str = "<option></option>";
		if(datatable != null) {
			$.each(datatable, function(index, data) {

				str += "<option value='" + data["GId"] + "'>";
				str += data["GroupName"];

				str += "</option>";
			});
		}

		return str;
	}
	/*删除笔组*/
	var GroupNa = "";
	$("#btn_Delstrokegroup").click(function() {
		var strokeGroup = $("#delete_strokegrouplist").val().trim();
		
		if(strokeGroup == "") {
			shalert("请选择笔组名称");
			return false;
		} else {
			shconfirm("确定要删除吗？", function(result) {
				if(result) {
					GroupNa = $("#delete_strokegrouplist").find("option:selected").text();
					var jsStr = "DeleteGroup {\"id\":\"" + strokeGroup + "\"}";

					send(jsStr);
				}
			});
		}
		$("#myStrokegroup_Drop").modal('hide');

	});
	/*笔组列表笔的显示隐藏*/
	function showHide() {
		$(".showOrhide").unbind('click');
		$(".showOrhide").on("click", function() {
			
			var seriesData1 = [];
			var tagName = $(this).parent().parent().find("td").eq(0).html();
			$.each(seriesData, function(index, data) {

				if(tagName == data["name"]) {
					if(data["show"] == "true" || data["show"] == undefined) {
						data["show"] = "false";

					} else {
						data["show"] = "true";
						seriesData1.push(data);
					
					}
				} else {
					if(data["show"] == "true" || data["show"] == undefined) {
						seriesData1.push(data);
					
					}

				}

			});
			if($(this).text() == "隐藏") {
				$(this).text("显示");
			} else {
				$(this).text("隐藏");
			}
			
			if(xAxisData.length > 0) {
				myChart2 = echarts.init(document.getElementById('echarts_line'));
				var option = {

					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: []
					},
					grid: [{
						containLabel: true,
						left: 80,
						right: 80,

					}, {
						containLabel: true,
						left: 80,
						right: 80,
						top: '55%',

					}],
					toolbox: {
						show: true,
						feature: {
							/*	dataView: {
									show: true,
									readOnly: false
								},
								restore: {
									show: true
								},
								saveAsImage: {
									show: true
								}*/
							mark: {
								show: false
							},
							dataView: {
								show: false,
								readOnly: false
							},
							magicType: {
								title: {
									line: '折线图切换',
									bar: '柱形图切换'
								},
								show: true,
								type: ['line', 'bar'],
								right: '20%'

							},
							restore: {
								show: false
							},
							saveAsImage: {
								show: false
							}

						}
					},
					dataZoom: [{
						show: true,

					}, {
						type: 'inside'
					}],
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: xAxisData

					}],
					yAxis: [{
						type: 'value',
						scale: true,
						name: ''
					}],
					series: seriesData1
				};
				/*获取图例*/
				legendData = [];
				for(var i = 0; i < seriesData1.length; i++) {
					legendData.push(seriesData1[i]["name"]);
				}

				myChart2.setOption(option);
				/*随浏览器的变化而变化*/
				window.onresize = function() {

					myChart2.resize(); //使第一个图表适应

				}

				option.series = seriesData1;

				option.legend.data = legendData;
				myChart2.setOption(option);
				/*for(var i = 0; i < xAxisData.length; i++) {
					dataTreedInfo.push({
						Tagname: tagGropList[colorid].Tagname,
						time: xAxisData[i],
						data: lineData[i],
						des: tagGropList[colorid].Description
					})
				}*/

			}

		});
	}
	/*笔组点表关联数据加载*/
	function tagGropListbind(datatable) {
		var str = "";
		if(datatable != null) {
			$.each(datatable, function(index, data1) {

				str += "<tr id=tagGrop" + data1["ID"] + " style='color:" + data1["Color"] + "'>";
				str += "<td>" + data1["Tagname"] + "</td>";
				str += "<td>" + data1["Description"] + "</td>";
				str += "<td>";

				if(groupName == "" || groupName == undefined) {
					str += "<button type='button' class='btn btn-success delgrop' data-value='" + data1["ID"] + "' style='padding: 0px 7px;'>";

				} else {

					str += "<button type='button' class='btn btn-success delgrop' groupname='" + groupName + "'+ data-value='" + data1["ID"] + "' style='padding: 0px 7px;'>";

				}
				str += "<span>删除</span></button>";
				str += "<button type='button' class='btn btn-primary Ccolor'  style='padding: 0px 7px;'><span>颜色配置</span></button>"
				str += "<button type='button' class='btn green showOrhide'  style='padding: 0px 7px;'><span>隐藏</span></button>"
				str += "</td>";
				str += "</tr>";
			});
		}

		return str;
	}
	/*点击笔组关联tr*/
	function bottomtr() {

		$(".rhTrendright_bottom tbody tr .Ccolor").on("click", function() {

			$(this).parent().parent().css("backgroundColor", "#DAF3F5").siblings().css("backgroundColor", "");
			colorStyle($(this).parent().parent());

		});
	}
	/*添加标签的确定按钮*/
	$("#close_Check").on("click", function() {
		/*关闭模态框*/

		$("#myModalTend_Add").modal('hide');
		
		ModalTreed();

	});

	function ModalTreed() {
		lineTreed();
		if(tagGropList.length > 0) {

			$("#rhTrendright_bottom").show();
			$("#li_savegroup1").show();
			$("#li_savegroup2").show();
		} else {
			$("#li_savegroup1").hide();
			$("#li_savegroup2").hide();
		}
	}
	/*获取点击的id号，修改颜色*/
	function colorStyle(_this) {
		trId = _this.attr("ID");

		$('.demo').val(RGBToHex(_this.css("color")));
		$(".minicolors-swatch-color").attr("style", "background-color:" + _this.css("color"));

		bottomtr();
	}
	/*Rgb 格式转为16进制*/

	function RGBToHex(rgb) {
		var regexp = /[0-9]{0,3}/g;
		var re = rgb.match(regexp); //利用正则表达式去掉多余的部分，将rgb中的数字提取
		var hexColor = "#";
		var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
		for(var i = 0; i < re.length; i++) {
			var r = null,
				c = re[i],
				l = c;
			var hexAr = [];
			while(c > 16) {
				r = c % 16;
				c = (c / 16) >> 0;
				hexAr.push(hex[r]);
			}
			hexAr.push(hex[c]);
			if(l < 16 && l != "") {
				hexAr.push(0)
			}
			hexColor += hexAr.reverse().join('');
		}

		return hexColor;
	}
	/*获取笔组点*/
	function GroupList(strokeid) {
		var dataList = [];

		$.each(tagList, function(index, data) {

			if(data["ID"] === strokeid) {

				dataList.push(data);
			}

		});

		return dataList;

	}

	//尝试连接至服务器
	try {
		socket = new WebSocket(host);
	} catch(exception) {
		shalert("对不起，您所使用的浏览器不支持WebSocket.");
		return false;
	}
	//连接成功
	socket.onopen = function() {
		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}
		//send("GetTagList");
		send("GetGroupList");
		$("#myModalTend_Add tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');

	}
	var tempNum = 0; /*判断笔组列表是否返回值*/
	//收到消息
	socket.onmessage = function(msg) {
		var result = msg.data;
		result = JSON.parse(result);

		if(result["error"]) {
			if($.cookie("user") == "" || $.cookie("user") == null) {
				shconfirm1(result["error"], function(result) {
					if(result) {

						window.parent.location.href = "../Login.html";
					}
				});
			} else {
				shalert(result["error"]);
			}
		} else if(result["exception"]) {
			shalert(result["exception"]);
			return false;
		} else {
			switch(result["Function"]) {
				case "GetTagList":
					tagList = result["data"];
					$("#myModalTend_Add tbody").html(tagListbind(result["data"]));
					tagleftClick();
					break;
				case "SelectTagList":
					tagList = result["data"];
					$("#myModalTend_Add tbody").html(tagListbind(result["data"]));
					tagleftClick();

					break;
				case "GetGroupList":
					strokeGroupList = result["data"];
					$("#input_strokegrouplist").html(strokeGroupbind(strokeGroupList));
					$("#delete_strokegrouplist").html(strokeGroupbind(strokeGroupList));
                   
                  /*添加笔组成功后，显示删除当前笔组，并且给删除当前笔组增data-id，以用来表明当前笔组*/
                    if($("#input_strokegroup").val() != "") {
                      	
						var value = "";
						$.each(strokeGroupList, function(index,data) {
							if(data.GroupName == $("#input_strokegroup").val()) {
							
								value = data.GId;
							}
						});
						
						$("#dele_this").attr("data-id", value);
						$("#dele_this").show();
						$("#dele_this_line").show();
						$("#input_strokegroup").val("");
					}
					break;
				case "SelectGroup":
					var strokeGroup = result["data"];

					tagGropList = [];
					$.each(strokeGroup, function(index, data) {
						if(isExist(data["ID"])) {
							tagGropList.push(data);

						}
					});

					$(".rhTrendright_bottom tbody").html(tagGropListbind(tagGropList));

					bottomtr();
					Ccolor();
					showHide();
					//标签删除
					$(".delgrop").click(function() {

						var trId = "tagGrop" + $(this).attr("data-value");
						var groupname = $(this).attr("groupname");
						var tagName = $(this).parent().parent().find("td").eq(0).html();

						if(trId != "") {
							shconfirm("确定要删除吗？", function(result) {
								if(result) {

									if(tagGropList != null) {
										for(var i = 0; i < tagGropList.length; i++) {
											if(("tagGrop" + tagGropList[i]["ID"]) == trId) {
												tagGropList.splice(i, 1);
											}
										}

										$("#" + trId).remove();

										if(tagGropList.length > 0) {
											for(var i = 0; i < seriesData.length; i++) {
												if(tagName == seriesData[i]["name"]) {
													seriesData.splice(i, 1);
													i--;
												}
											}
											if(xAxisData.length > 0) {
												myChart3 = echarts.init(document.getElementById('echarts_line'));
												var option = {

													tooltip: {
														trigger: 'axis'
													},
													legend: {
														data: ['High', 'Low']
													},
													toolbox: {
														show: true,
														feature: {
															/*	dataView: {
																	show: true,
																	readOnly: false
																},
																restore: {
																	show: true
																},
																saveAsImage: {
																	show: true
																}*/
															mark: {
																show: false
															},
															dataView: {
																show: false,
																readOnly: false
															},
															magicType: {
																title: {
																	line: '折线图切换',
																	bar: '柱形图切换'
																},
																show: true,
																type: ['line', 'bar'],
																right: '20%'

															},
															restore: {
																show: false
															},
															saveAsImage: {
																show: false
															}

														}
													},

													xAxis: [{
														type: 'category',
														boundaryGap: false,
														data: xAxisData

													}],
													yAxis: [{
														type: 'value',
														scale: true,
														name: ''
													}],
													series: seriesData
												};

												// 为echarts对象加载数据
												myChart3.setOption(option);
												/*随浏览器的变化而变化*/
												window.onresize = function() {

														myChart3.resize(); //使第一个图表适应

													}
													/*获取图例*/
												legendData = [];
												for(var i = 0; i < seriesData.length; i++) {
													legendData.push(seriesData[i]["name"]);
												}

												//option.xAxis[0].data = xAxisData;

												option.series = seriesData;

												option.legend.data = legendData;
												myChart3.setOption(option);

											}

										} else if(tagGropList.length == 0) {

											$("#echarts_line").css("display", "none");

										}

									}

									if(groupname != "" && groupname != undefined) {
										strokeGroup = groupname;

										var tagids = IDTag(tagGropList).join(',');
										var colors = ColorTag(tagGropList).join(',');

										var jsStr = "AddGroup {\"name\":\"" + strokeGroup + "\",\"ids\":\"" + tagids + "\",\"colors\":\"" + colors + "\"}";
										send(jsStr);

									}
								}
							});

						} else {
							shalert("请选择要删除的笔")
						}

					});

					break;
				case "AddGroup":
					
					shalert("保存成功！")
                    /*重新绑定笔组列表*/
					send("GetGroupList");

					groupName = "";
				$(".rhTrendright_bottom tbody tr .delgrop").attr("groupname",$("#input_strokegroup").val())
					/*给删除当前笔组按钮赋值*/
					$("#myStrokegroup_Add").modal('hide');
					break;
				case "DeleteGroup":
					shalert(result["info"]);
					/*重新绑定笔组列表*/
					send("GetGroupList");

					/*判定是否做了选择笔组操作，如果标签表中*/

					if(tagGropList.length != 0) {
						var groupName = $(".rhTrendright_bottom tbody tr").eq(0).find(".delgrop").attr("groupname");
						console.log(groupName)
						console.log(GroupNa)
						if(groupName == GroupNa) {
							/*var objtr = $(".rhTrendright_bottom tbody tr");

							for(var i = 0; i < objtr.length; i++) {
								var Name = $(".rhTrendright_bottom tbody tr").eq(i).find(".delgrop").attr("groupname")
								if(Name == GroupNa) {*/
									$(".rhTrendright_bottom tbody tr").remove();
									myChart.clear();
									tagGropList = "";
									/*i--;
								}
							}*/

						}
						
					}
					groupName = "";
					if(tempbtn=="1")
					{
					$("#dele_this").removeAttr("data-id");
					$("#dele_this").hide();
                    $("#dele_this_line").hide();
                    tempbtn="";
					}
					
					break;

				case "GetHistoryData":

					var dataList = result["data"];
					
					btnTrend.showLoading({
						text: "图表数据正在努力加载..."
					});
					window.clearTimeout(timeTicket);

					myChart.clear();

					lineData = [];
					if(dataList == null) {
						dataList = [];
					}
					if(dataList.length != 0) {
						tempNum++;
					}

					var type = "";
					if(btnTrend == myChart) {
						type = "line";
					}
					if(dataList.length == 0) {
						seriesData.push({
							name: tagGropList[colorid].Tagname,
							type: type,
							smooth: true,
							data: []
						});

					} else {
						xAxisData = [];

						for(var i = 0; i < dataList.length; i++) {
							xAxisData.push(dataList[i]["TimeStamp"]);
							//lineData.push(dataList[i]["Value"] * (item + 1));
							lineData.push(dataList[i]["Value"]);

						}
					
						if(btnTrend == myChart) {
							seriesData.push({
								name: tagGropList[colorid].Tagname,
								type: "line",
								smooth: true,
								barMaxWidth: 10,
								barGap: '1%',
								data: lineData,
								itemStyle: {
									normal: {
										color: tagGropList[colorid].Color
									}
								}
							});
						} else {

							seriesData.push({
								name: tagGropList[colorid].Tagname,
								type: "bar",

								barMaxWidth: 10,
								barGap: '1%',
								data: lineData,
								itemStyle: {
									normal: {
										color: tagGropList[colorid].Color
									}
								}
							});
						}

					}

					btnTrend.clear();
					if(xAxisData.length > 0) {

						legendData.push(tagGropList[colorid].Tagname);

						option.xAxis[0].data = xAxisData;

						option.xAxis[0].boundaryGap = false;

						option.series = seriesData;

						option.legend.data = legendData;
						btnTrend.setOption(option);
						for(var i = 0; i < xAxisData.length; i++) {
							dataTreedInfo.push({
								Tagname: tagGropList[colorid].Tagname,
								time: xAxisData[i],
								data: lineData[i],
								des: tagGropList[colorid].Description
							})
						}

					}

					colorid++;
					if(colorid == tagGropList.length) {

						if(tempNum == 0) {
							shalert("您选择的点没有数据，请重新选择！")
							btnTrend.hideLoading();
							disabled_btn();

							$("#btn_fullscreen").attr("disabled", false);
							return false;
						} else {
							btnTrend.hideLoading();
							disabled_btn();

							$("#btn_fullscreen").attr("disabled", false);
							
							$("#myTreedInfo table tbody").html(TreedInfo(dataTreedInfo));

							$("#btn_TreedInfo").show();
							/*列表中的所有按钮文本初始化为隐藏*/
							$(".showOrhide").text("隐藏");
						}

					}

					break;

			}
		}
	}
	var dataTreedInfo = [];

	function TreedInfo(dataTreedInfo) {
		var str = "";

		if(dataTreedInfo.length > 0) {

			$.each(dataTreedInfo, function(index, data) {

				str += "<tr>";

				str += "<td>" + data["Tagname"] + "</td>";
				str += "<td>" + data["time"] + "</td>";
				str += "<td>" + data["data"] + "</td>";
				str += "<td>" + data["des"] + "</td>";
				str += "</tr>";
			});
		}
		
		return str;
	}
	/*对按钮的隐藏*/
	function disabled_btn() {
		$("#btnToday").attr("disabled", false);
		$("#btnMonth").attr("disabled", false);
		$("#btnMonth_3").attr("disabled", false);
		$("#btnMonth_6").attr("disabled", false);
		$("#btnYear").attr("disabled", false);
		$("#btnGo").attr("disabled", false);
		$("#btnBack").attr("disabled", false);
		$("#btnYesterday").attr("disabled", false);
		$("#btnYesteryear").attr("disabled", false);
		$("#btnYesterMonth").attr("disabled", false);
		$("#btnWeek").attr("disabled", false);
		$("#btnYesterWeek").attr("disabled", false);
		$("#btn_select").attr("disabled", false);
	}
	/*判断浏览器*/
	function goPAGE() {
		if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			$(".div1 .portlet-body").css("height", pFrameHeight - 600);
			$(".div1 input").css("width", "210px");
			window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
				if(window.orientation === 180 || window.orientation === 0) {
					var height = window.screen.height;

					$(".div1 .portlet-body").css("height", height - 80); //.width(height);
				}
				if(window.orientation === 90 || window.orientation === -90) {

					var height = window.screen.width;

					$(".div1 .portlet-body").css("height", height - 80); //.width("550px");

				}
			}, false);

		} else {
			$(".div1 .portlet-body").css("height", pFrameHeight * 0.6);
			$(".div1 input").css("width", "600px");
		}
	}
	/*模态框的显示*/
	$('#myModalTend_Add').on('shown.bs.modal', function(e) {

		send("GetTagList");

		goPAGE();

	});

	/*模态框关闭*/
	$("#closeX").on("click", function() {
	  
         $(this).removeData("bs.modal");
		send("GetTagList");
       
		goPAGE();
		
		$("#close_Check").click();

		$("#input_name").val("");
		
	});
	/*趋势详细信息模态框的显示*/
	$('#myTreedInfo').on('shown.bs.modal', function(e) {

		goPAGE();

	});
	/*趋势详细信息模态框关闭*/
	$("#myTreedInfo").on("hidden.bs.modal", function() {
		goPAGE();
	});
	/*趋势详细信息隐藏*/
	$("#btn_TreedInfo").on("click", function() {
		$("#myTreedInfo").modal('hide');
	});
	//连接断开
	socket.onclose = function(event) {
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

});