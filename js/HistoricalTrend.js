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
$(".rhTrendright_top_top").css("height", "120px");
$(".rhTrendright_top").css("height", height * 0.12);
$(".rhTrendright_middle").css("height", height * 0.45);
$("#echarts_line").css("height", height * 0.41);
$(".rhTrendright_bottom").css("height", height * 0.35);
$(".rhTrendright_right_top").css("height", height);
var leftheight = $(".rhTrendleftTitle").height();
//$(".div1 .portlet-body").css("height", height - leftheight);
var tags = new Array();
jQuery(document).ready(function() {
	/*采集周期的修改*/
	$("#cycleValue").attr("disabled", true);
	$("#cycleType").attr("disabled", true);
	
	/*判定点击的此行是否已经存在*/
	function isExist(id) {
		var boolE = true;
		$.each(tagGropList, function(index, data) {

			if(data["ID"] == id) {
				boolE = false;
			}

		});

		return boolE;
	}

	$("[name='my-checkbox']").bootstrapSwitch();

	$("#switchlight").bootstrapSwitch({
		size: "large",
		state: true
	});

	// ECHARTS
	require.config({
		paths: {

			echarts: '../resource/echarts/'
		}
	});

	/*.rhTrendright_middle,.rhTrendright_bottom*/

	// DEMOS
	require(
		[
			'echarts',
			'echarts/chart/bar',
			'echarts/chart/chord',
			'echarts/chart/eventRiver',
			'echarts/chart/force',
			'echarts/chart/funnel',
			'echarts/chart/gauge',
			'echarts/chart/heatmap',
			'echarts/chart/k',
			'echarts/chart/line',
			'echarts/chart/map',
			'echarts/chart/pie',
			'echarts/chart/radar',
			'echarts/chart/scatter',
			'echarts/chart/tree',
			'echarts/chart/treemap',
			'echarts/chart/venn',
			'echarts/chart/wordCloud'

		],
		function(ec) {
			//时间初始化
			var sDate = new Date();
			$("#startTime").val(formatDate(sDate, 0) + " 08：00：00");
			$("#endTime").val(formatDate(sDate, 0) + " 08：00：10");
			// --- LINE ---

			var myChart = ec.init(document.getElementById('echarts_line'));
			var option = {

				tooltip: {
					trigger: 'axis'
				},

				toolbox: {
					show: true,
					feature: {
						dataView: {
							show: true,
							readOnly: false
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
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

			//柱状图

			//--- BAR ---

			var myChart1 = ec.init(document.getElementById('echarts_bar'));

			myChart1.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['Cost', 'Expenses']
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: true
						},
						dataView: {
							show: true,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					boundaryGap: true,
					data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

				}],
				yAxis: [{
					type: 'value',
					splitArea: {
						show: true
					}
				}],
				series: [
					/*{
										name: 'Cost',
										type: 'bar',
										data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
									}, {
										name: 'Expenses',
										type: 'bar',
										data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
									}, {
										name: 'Expenses',
										type: 'bar',
										data: [3.0, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
									}*/
				]
			});

			/*随浏览器的变化而变化*/
			window.onresize = function() {

				myChart1.resize(); //使第一个图表适应

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
			$("#btn_history").on('click', function() {
				//alert(11);
				btnTrend = myChart;
				/*判断开始结束时间段的差，如果相差*/
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				historyLineFunction();
				seriesData = [];

			});
			/*柱状图点击*/
			$("#btn_bar").on("click", function() {
				//alert(11);
				btnTrend = myChart1;
				seriesData = [];
				$("#echarts_line").css("display", "none");
				$("#echarts_bar").css("display", "block");
				bar();
			});
			//柱状图的数据加载
			function bar() {
				/*判定*/
				if(tagGropList.length == 0) {
					shalert("请选择点！");
					disabled_btn();
					return false;
				}
				btnTrend = myChart1;
				tempNum = 0;
				btnTrend.showLoading({
					text: "图表数据正在努力加载..."
				});
				var tags = realTag(tagGropList);
				var start = $("#startTime").val().replace(/\：/g, ':');
				var end = $("#endTime").val().replace(/\：/g, ':');

				colorid = 0;
				//seriesData=[];
				var hour = GetDateDiff(start, end, "hour");
				var value = 1;
				var type = 1;
				if(hour <= 1) /*一小时之内的以1s查询*/ {
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("1");
					$("#cycleType").val("1");
					value = 1;
					type = 1;
				} else if(hour > 1 && hour <= 2)
				/*两小时内的以半小时查询*/
				{
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("30");
					$("#cycleType").val("2");
					value = 30;
					type = 2;
				} else if(hour > 2 && hour <= 24)
				/*一天之内的以2小时*/
				{
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("2");
					$("#cycleType").val("3");
					value = 2;
					type = 3;
				} else if(hour > 24 && hour <= 48)
				/*两天之内的以4小时间隔*/
				{
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("4");
					$("#cycleType").val("3");
					value = 4;
					type = 3;
				} else if(hour > 48 && hour <= 31 * 24) { /*一个月，以48小时间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("48");
					$("#cycleType").val("3");
					value = 48;
					type = 3;
				} else if(hour >= 31 * 24 && hour < 31 * 24 * 3) { /*三个月内，以1个月为间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("1");
					$("#cycleType").val("4");
					value = 30 * 24;
					type = 3;
				} else if(hour >= 31 * 24 * 3 && hour < 31 * 24 * 6) { /*6个月内，以2月为间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("2");
					$("#cycleType").val("4");
					value = 30 * 24 * 2;
					type = 3;
				} else if(hour >= 31 * 24 * 6 && hour < 31 * 24 * 12) {
					/*12个月内，以4月为间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("4");
					$("#cycleType").val("4");
					value = 30 * 24 * 4;
					type = 3;
				} else {
					$("#cycleValue").attr("disabled", false);
					$("#cycleType").attr("disabled", false);
					$("#cycleValue").val("1");
					$("#cycleType").val("2");
					value = 1;
					type = 2;
				}
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				var cvalue = value;
				var ctyle = type;
				for(var i = 0; i < tags.length; i++) {

					var jsStr = "GetHistoryData {\"tags\":\"" + tags[i] + "\",\"start\":\"" + start + "\",\"end\":\"" + end + "\",\"cvalue\":\"" + cvalue + "\",\"ctype\":\"" + ctyle + "\"}";
					send(jsStr);
				}

			}
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
				$(".div1 tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
				var jsStr = "SelectTagList {\"name\":\"" + $("#input_name").val().trim() + "\"}";

				send(jsStr);

			});
			var xAxisData = new Array();
			var seriesData = new Array();
			var value = 1;
			var type = 1;

			function historyLineFunction() {
				/*判定*/
				if(tagGropList.length == 0) {
					shalert("请选择点！");
					disabled_btn();
					return false;
				}

				tempNum = 0;
				btnTrend = myChart;
				console.log(btnTrend);
				btnTrend.showLoading({
					btnTrendtext: "图表数据正在努力加载..."
				});
				var tags = realTag(tagGropList);
				var start = $("#startTime").val().replace(/\：/g, ':');
				var end = $("#endTime").val().replace(/\：/g, ':');

				colorid = 0;
				//seriesData=[];
				var hour = GetDateDiff(start, end, "hour");

				if(hour <= 1) /*一小时之内的以1s查询*/ {
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("1");
					$("#cycleType").val("1");
					value = 1;
					type = 1;
				} else if(hour > 1 && hour <= 2)
				/*两小时内的以半小时查询*/
				{
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("30");
					$("#cycleType").val("2");
					value = 30;
					type = 2;
				} else if(hour > 2 && hour <= 24)
				/*一天之内的以2小时*/
				{
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("2");
					$("#cycleType").val("3");
					value = 2;
					type = 3;
				} else if(hour > 24 && hour <= 48)
				/*两天之内的以4小时间隔*/
				{
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("4");
					$("#cycleType").val("3");
					value = 4;
					type = 3;
				} else if(hour > 48 && hour <= 31 * 24) { /*一个月，以48小时间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("48");
					$("#cycleType").val("3");
					value = 48;
					type = 3;
				} else if(hour >= 31 * 24 && hour < 31 * 24 * 3) { /*三个月内，以1个月为间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("1");
					$("#cycleType").val("4");
					value = 30 * 24;
					type = 3;
				} else if(hour >= 31 * 24 * 3 && hour < 31 * 24 * 6) { /*6个月内，以2月为间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("2");
					$("#cycleType").val("4");
					value = 30 * 24 * 2;
					type = 3;
				} else if(hour >= 31 * 24 * 6 && hour < 31 * 24 * 12) {
					/*12个月内，以4月为间隔*/
					$("#cycleValue").attr("disabled", true);
					$("#cycleType").attr("disabled", true);
					$("#cycleValue").val("4");
					$("#cycleType").val("4");
					value = 30 * 24 * 4;
					type = 3;
				}else
				{
					$("#cycleValue").attr("disabled", false);
					$("#cycleType").attr("disabled", false);
					$("#cycleValue").val("1");
					$("#cycleType").val("2");
					value = 1;
					type = 2;
				}
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				var cvalue = value;
				var ctyle = type;
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
				/*早班*/
			$("#btnZShift").on("click", function() {

					$("#startTime").val($("#startTime").val().toString().split(' ')[0] + " 00：00：00");

					$("#endTime").val($("#startTime").val().toString().split(' ')[0] + " 08：00：00");
					//historyLineFunction();

				})
				/*中班*/
			$("#btnMShift").on("click", function() {
					$("#startTime").val($("#startTime").val().toString().split(' ')[0] + " 08：00：00");
					$("#endTime").val($("#startTime").val().toString().split(' ')[0] + " 16：00：00");
					$("#cycleValue").val("10");
					$("#cycleType").val("1");

					historyLineFunction();
				})
				/*晚班*/
			$("#btnHShift").on("click", function() {
					$("#startTime").val($("#startTime").val().toString().split(' ')[0] + " 16：00：00");

					$("#endTime").val($("#startTime").val().toString().split(' ')[0] + " 23：59：59");

					$("#cycleValue").val("1");
					$("#cycleType").val("2");
					historyLineFunction();
				})
				/*今天*/
			$("#btnToday").on("click", function() {
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				colorid = 0;
				seriesData = [];
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
				var sDate = new Date();
				$("#startTime").val(formatDate(sDate, 0) + " 08：00：00");
				$("#endTime").val(formatDate(sDate, 0) + " 08：00：10");
				$("#startTime").val($("#startTime").val().toString().split(' ')[0] + " 00：00：00");
				$("#endTime").val($("#startTime").val().toString().split(' ')[0] + " 23：59：59");
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("2");
				$("#cycleType").val("3");
				value = 2;
				type = 3;
				historyLineFunction();
			});
			//本月趋势
			$("#btnMonth").on("click", function() {
				colorid = 0;
				seriesData = [];
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				$("#btnToday").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
				var year = sDate.getFullYear();
				var month = sDate.getMonth() + 1;
				var day = new Date(year, month, 0);
				$("#startTime").val(year + '-' + month + '-01' + " 00：00：00");
				$("#endTime").val(year + '-' + month + '-' + day.getDate() + " 23：59：59");
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("48");
				$("#cycleType").val("3");
				value = 48;
				type = 3;
				historyLineFunction();
			});
			/*三个月*/
			$("#btnMonth_3").on("click", function() {
				colorid = 0;
				seriesData = [];
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				//$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
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
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("1");
				$("#cycleType").val("4");
				value = 30 * 24;
				type = 3;
				historyLineFunction();
			});
			/*半年*/
			$("#btnMonth_6").on("click", function() {
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				colorid = 0;
				seriesData = [];
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				//$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
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
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("2");
				$("#cycleType").val("4");
				value = 30 * 24 * 2;
				type = 3;
				historyLineFunction();
			});
			/*一年*/
			$("#btnYear").on("click", function() {
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				colorid = 0;
				seriesData = [];
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				//$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
				var year = sDate.getFullYear();

				$("#startTime").val(year + '-' + "01" + '-01' + " 00：00：00");
				$("#endTime").val(year + '-' + "12" + '-' + "31" + " 23：59：59");
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("4");
				$("#cycleType").val("4");
				value = 30 * 24 * 4;
				type = 3;
				historyLineFunction();
			});
			/*前一天*/
			$("#btnYesterday").on("click", function() {
				colorid = 0;
				seriesData = [];
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				//$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
				//var start = $("#startTime").val().toString();
				var start = new Date($("#startTime").val().replace(/\：/g, ':'));
				//var et = new Date($("#endTime").val().replace(/\：/g, ':'));
				console.log(start);
				start.setDate(start.getDate() - 1); //获取AddDayCount天后的日期
				var y = start.getFullYear();
				var m = start.getMonth() + 1; //获取当前月份的日期 
				var d = start.getDate();
				//var end = $("#startTime").val().toString();
				$("#startTime").val(y + "-" + m + "-" + d + " 00：00：00");
				$("#endTime").val(y + "-" + m + "-" + d + " 23：59：59");
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("2");
				$("#cycleType").val("3");
				value = 2;
				type = 3;
				historyLineFunction();
			});
			/*上一年*/
			$("#btnYesteryear").on("click", function() {
				colorid = 0;
				seriesData = [];
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				$("#btnYesterday").attr("disabled", true);
				//$("#btnYesteryear").attr("disabled", true);
				var start = new Date($("#startTime").val().replace(/\：/g, ':'));
				//  console.log(start.getFullYear()-1)
				// start.setDate(start.getFullYear() - 1); //获取AddDayCount天后的日期
				var y = start.getFullYear() - 1;

				$("#startTime").val(y + "-" + "01" + "-" + "01" + " 00：00：00");
				$("#endTime").val(y + "-" + "12" + "-" + "31" + " 23：59：59");
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("4");
				$("#cycleType").val("4");
				value = 30 * 24 * 4;
				type = 3;
				historyLineFunction();
			});
			/*上个月*/
			$("#btnYesterMonth").on("click", function() {
				colorid = 0;
				seriesData = [];
				$("#echarts_line").css("display", "block");
				$("#echarts_bar").css("display", "none");
				$("#btnToday").attr("disabled", true);
				$("#btnMonth").attr("disabled", true);
				$("#btnMonth_3").attr("disabled", true);
				$("#btnMonth_6").attr("disabled", true);
				$("#btnYear").attr("disabled", true);
				$("#btnGo").attr("disabled", true);
				$("#btnBack").attr("disabled", true);
				//$("#btnYesterday").attr("disabled", true);
				$("#btnYesteryear").attr("disabled", true);
				//var start = $("#startTime").val().toString();
				var start = new Date($("#startTime").val().replace(/\：/g, ':'));
				var et = new Date($("#endTime").val().replace(/\：/g, ':'));

				var y = start.getFullYear();
				var m = start.getMonth(); //获取当前月份的日期 
				var d = new Date(y, m, 0);

				//var end = $("#startTime").val().toString();
				$("#startTime").val(y + "-" + m + "-" + "01" + " 00：00：00");
				$("#endTime").val(y + "-" + m + "-" + d.getDate() + " 23：59：59");
				$("#cycleValue").attr("disabled", true);
				$("#cycleType").attr("disabled", true);
				$("#cycleValue").val("48");
				$("#cycleType").val("3");
				value = 48;
				type = 3;
				historyLineFunction();
			});
			/*全屏*/
			$("#btn_fullscreen").on("click", function() {

				$("#close_treed").css('display', 'block');

				$(".rhTrendright_bottom").css('display', 'none');
				$(".rhTrendright_middle").addClass("topboder");
				$(".rhTrendright_right").css('display', 'none');
				$(".bottom_title").css('display', 'none');
				$(".rhTrendright_top").css('display', 'none');
				$(".rhTrendright_top_top").css('display', 'none');
				$(".rhTrendright_middle").css("height", height);
				$("#echarts_line").css("height", height * 0.95);
				$("#echarts_bar").css("height", height * 0.95);
				if(btnTrend == myChart) {
					myChart.resize();
				} else {
					myChart1.resize();
				}

			});
			/*关闭全屏*/
			$("#close_treed").on("click", function() {
				$("#close_treed").css('display', 'none');
				$(".rhTrendright_middle").css("height", height * 0.45);
				$("#echarts_line").css("height", height * 0.42);
				$("#echarts_bar").css("height", height * 0.42);
				$(".rhTrendright_middle").removeClass("topboder");
				$(".rhTrendright_bottom").css('display', 'block');
				$(".bottom_title").css('display', 'block');
				$(".rhTrendright_right").css('display', 'none');
				$(".rhTrendright_top").css('display', 'block');
				$(".rhTrendright_top_top").css('display', 'block');
				if(btnTrend == myChart) {
					myChart.resize();
				} else {
					myChart1.resize();
				}

			});
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
			$("#btn_Delstrokegroup").click(function() {
				var strokeGroup = $("#input_strokegrouplist").val().trim();

				shconfirm("确定要删除吗", function(result) {

					if(result) {
						var jsStr = "DeleteGroup {\"id\":\"" + strokeGroup + "\"}";

						send(jsStr);
					}

				});
			});
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
								Ccolor();
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

			/*选择列表*/
			$("#Ccheck").on("click", function() {

				if($(".rhTrendright_bottom").is(":hidden")) {
					$(".rhTrendright_middle").css("height", height * 0.45);
					$("#echarts_line").css("height", height * 0.42);
					$("#echarts_bar").css("height", height * 0.42);
					$(".rhTrendright_bottom").css('display', 'block');
					$("#Ccheck").text("隐藏列表");
				} else {
					$("#echarts_line").css("height", height * 0.76);
					$("#echarts_bar").css("height", height * 0.76);
					$(".rhTrendright_middle").css("height", height * 0.8);
					$(".rhTrendright_bottom").css('display', 'none');
					$("#Ccheck").text("显示列表");
				}
				if(btnTrend == myChart) {
					myChart.resize();
				} else {
					myChart1.resize();
				}

			});

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

				$(".div1 tbody tr input").on("click", function() {
					var truey = $(this).find('input[name=check_table]').context.checked;
					$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style");
					if(truey) {

						if(isExist("tagGrop" + $(this).attr("ID"))) {
							/*页面动态加载*/

							[tagList[$(this).attr("data-index")]][0]["Color"] = colorArray[colorItem];
							$(".rhTrendright_bottom tbody").append(tagGropListbind([tagList[$(this).attr("data-index")]]));
							$(".rhTrendright_bottom tbody button").click(function() {

								deletegroup("tagGrop" + $(this).attr("data-value"));
							});
							bottomtr();
							Ccolor();
							tagGropList.push(tagList[$(this).attr("data-index")]);
							colorItem++;
						}

					} else {

						deletegroup("tagGrop" + $(this).attr("ID"))
					}

				});

			}

			/*笔组切换*/
			function selectGroup() {

				var jsStr = "SelectGroup {\"id\":\"" + $("#input_strokegrouplist").val().trim() + "\"}";

				send(jsStr);
			}

			$("#input_strokegrouplist").on("change", function() {

					selectGroup();
				}

			);

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
			/*笔组点表关联数据加载*/
			function tagGropListbind(datatable) {
				var str = "";
				if(datatable != null) {
					$.each(datatable, function(index, data1) {

						str += "<tr id=tagGrop" + data1["ID"] + " style='color:" + data1["Color"] + "'>";
						str += "<td>" + data1["Tagname"] + "</td>";
						str += "<td>" + data1["Description"] + "</td>";
						str += "<td>";
						str += "<button type='button' class='btn btn-success delgrop' data-value='" + data1["ID"] + "' style='padding: 3px 7px;'>";
						str += "<span>删除</span></button>";
						str += "<button type='button' class='btn green Ccolor'  style='padding: 3px 7px;'><span>颜色配置</span></button>"
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
				$(".div1 tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');

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
							$(".div1 tbody").html(tagListbind(result["data"]));
							tagleftClick();
							break;
						case "SelectTagList":
							tagList = result["data"];
							$(".div1 tbody").html(tagListbind(result["data"]));
							tagleftClick();
							break;
						case "GetGroupList":
							strokeGroupList = result["data"];
							$("#input_strokegrouplist").html(strokeGroupbind(strokeGroupList));
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
							break;
						case "AddGroup":
							shalert("添加成功！")
							send("GetGroupList");
							break;
						case "DeleteGroup":
							shalert(result["info"])
							send("GetGroupList");
							$(".rhTrendright_bottom tbody").html("");
							break;

						case "GetHistoryData":
							
							var dataList = result["data"];
							console.log(dataList);

							btnTrend.showLoading({
								text: "图表数据正在努力加载..."
							});
							window.clearTimeout(timeTicket);

							btnTrend.clear();

							//console.log(tagGropList.length);

							//$.each(tagGropList, function(item, data) {
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
							} else {
								type = "bar";
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

										data: lineData,
										itemStyle: {
											normal: {
												color: tagGropList[colorid].Color
											}
										}
									});
								} else {
									/*name: 'Cost',
										type: 'bar',
										data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
								*/
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
								//console.log(lineData);

							}

							//});
							colorid++;
							btnTrend.clear();
							if(xAxisData.length > 0) {
								//console.log(xAxisData);

								option.xAxis[0].data = xAxisData;
								if(btnTrend == myChart1) {
									option.xAxis[0].boundaryGap = true;
									//	option.xAxis[0].axisLabel=rotate: 60;
									/*									axisLabel: {
									                              rotate: 60,
									},*/
									//console.log(option.xAxis[0])
								} else {
									option.xAxis[0].boundaryGap = false;
								}
								option.series = seriesData;
								btnTrend.setOption(option);
							}
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
								}

							}

							break;

					}
				}
			}

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
			}
			/*判断浏览器*/
			function goPAGE() {
						if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
							$(".div1 .portlet-body").css("height", pFrameHeight-600);
							$(".div1 input").css("width", "210px");
						} else {
							$(".div1 .portlet-body").css("height", pFrameHeight * 0.6);
							$(".div1 input").css("width", "600px");
						}
					}
			/*模态框的显示*/
			$('#myModalTend_Add').on('shown.bs.modal', function(e) {

					send("GetTagList");
					
                       goPAGE();
					
					

				})
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
});