/*查询*/
var tagList = [{
		"id": "1",
		"Tagname": "GPY00_N60_YM3_KC1",
		"description": "描述",
		"Color": "#0000FF",
	}, {
		"id": "2",
		"Tagname": "GPY00_N60_YM3_KC2",
		"description": "描述",
		"Color": "#0000FF"
	}, {
		"id": "3",
		"Tagname": "GPY00_N60_YM3_KC3",
		"description": "描述",
		"Color": "#009DC7"
	}, {
		"id": "4",
		"Tagname": "GPY00_N60_YM3_KC4",
		"description": "描述",
		"Color": "#0000FF"
	}, {
		"id": "5",
		"Tagname": "GPY00_N60_YM3_KC5",
		"description": "描述"
	}]
	/*模拟笔组集合 在选择笔组后保存到tagGropList*/
var tagGropList = [];

var echartData = {
	seriesData: [{
			data: [400, 300, 100, 20, 30],
			itemStyle: {
				normal: {
					color: "#0000FF"
				}
			},
			name: "GPY00_N60_YM3_KC1",
			type: "line",
			smooth: true,
		}, {
			"data": [1400, 700, 100, 600, 30],
			"itemStyle": {
				normal: {
					color: "#0000FF"
				}
			},
			name: "GPY00_N60_YM3_KC2",
			type: "line",
			smooth: true,
		}, {
			"data": [200, 900, 1000, 20, 300],
			"itemStyle": {
				normal: {
					color: "#0000FF"
				}
			},
			name: "GPY00_N60_YM3_KC3",
			type: "line",
			smooth: true,
		}

	],
	xAxisData: ["2016-11-03 11:42:10", "2016-11-03 11:42:20", "2016-11-03 11:42:30", "2016-11-03 11:42:40", "2016-11-03 11:42:50"]
}

var strokeGroupList = [{
	"id": "1",
	"Groupname": "空压机"
}, {
	"id": "2",
	"Groupname": "test"
}]
var colorArray = [
	'#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
	'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
	'#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
	'#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
]; /*颜色初始化*/
var timeTicket; /*定时器*/
var trId = ""; /*存放点击id*/
var colorItem = 0; /*存储颜色id*/
var height = pFrameHeight - pTitleHeight - 30;
$(".rhTrendleft").css("height", height);
$(".rhTrendright").css("height", height);
$(".rhTrendright_right").css("height", height);

$(".rhTrendright_top").css("height", height * 0.25);
$(".rhTrendright_middle").css("height", height * 0.4);
$("#echarts_line").css("height", height * 0.36);
$(".rhTrendright_bottom").css("height", height * 0.35);
$(".rhTrendright_right_top").css("height", height);
var tags = new Array();
jQuery(document).ready(function() {
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

			'echarts/chart/line',

		],
		function(ec) {

			//时间初始化

			var sDate = new Date();

			$("#startTime").val(formatDate(sDate, 0) + " 08：00：00");
			$("#endTime").val(formatDate(sDate, 0) + " 08：00：10");

			/*数据绑定*/
			/*$(".rhTrendleft tbody").html(tagListbind(tagList));*/
			/*笔组加载*/
			function strokeGroupbind(datatable) {
				var str = "";
				if(datatable != null) {
					$.each(datatable, function(index, data) {

						str += "<option value='" + data["id"] + "'>";
						str += data["Groupname"];

						str += "</option>";
					});
				}

				return str;
			}
			$("#input_strokegrouplist").html(strokeGroupbind(strokeGroupList));
			/*笔组切换*/
			$("#input_strokegrouplist").on("change", function() {
					var strokeGroup = [{
						"id": "1",
						"Tagname": "GPY00_N60_YM3_KC1",
						"description": "描述",
						"Color": "#0000FF",

					}, {
						"id": "3",
						"Tagname": "GPY00_N60_YM3_KC3",
						"description": "描述",
						"Color": "#009DC7",

					}, {
						"id": "5",
						"Tagname": "GPY00_N60_YM3_KC5",
						"description": "描述",

					}]
					$.each(strokeGroup, function(index, data) {
						if(isExist(data["id"])) {
							tagGropList.push(data);
						}
					});
					$(".rhTrendright_bottom tbody").html(tagGropListbind(tagGropList));

					//$(this).val();
					/*笔组关联点的数据加载*/

					//------------end-----------------------------------------

				}

			);
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
								$(".rhTrendright_bottom tbody tr").on("click", function() {

									//	$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style", "background-color: #DAF3F5");
									trId = $(this).attr("id");

								});
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
				/*实时趋势点的id值*/
			function realTag(tagGropList) {
				$.each(tagGropList, function(index, data) {
					tags.push(data["Tagname"]);

				})
				return tags;
			}
			/*实时趋势*/
			//全局Socket对象
				var socket1;
				var readyStatus1 = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
				var host1 = "ws://36.110.66.3:29001";

			$("#btn_real").on("click", function() {
				if(socket1!=null)
				{
					socket1.close();
				}
				//尝试连接至服务器
				try {
					socket1 = new WebSocket(host1);
				} catch(exception) {
					shalert("对不起，您所使用的浏览器不支持WebSocket.");
				}
				//发送
				function send(msg) {

					/*if(tags.length > 0) {
						socket1.send(tags);
					}*/
				}
				//连接断开
				socket1.onclose = function(event) {

						console.log("Socket实时状态:" + readyStatus1[socket1.readyState]);
						//location.href = "http://www.baidu.com";
					}
					//断开连接
				function disconnect() {
					socket1.close();
				}
				if(tagGropList != null) {
					tags = realTag(tagGropList);

					var tagsArray = new Array();
					option = {

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
								magicType: {
									show: false,
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
						xAxis: [{
							type: 'category',
							boundaryGap: false,
							data: (function() {
								var now = new Date();
								var res = [];
								var len = 10;
								while(len--) {
									res.unshift(now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay() + " " + now.toLocaleTimeString().replace(/^\D*/, ''));
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

					option.series = [];
					var dataIndex = 0;
					$.each(tagGropList, function(item, data) {
						tagsArray.push(data.Tagname);
						option.series.push({
							name: data.Tagname,
							type: 'line',
							smooth: true,
							itemStyle: {
								normal: {
									color: data.Color
								}
							},
							data: (function() {
								var res = [];
								var len = 10;
								while(len--) {
									res.push("");
								}
								return res;
							})()
						});
					});

					myChart.clear();
					myChart.setOption(option);
					var axisData;

					window.clearTimeout(timeTicket);

					var intervalValue = 1000;
					var sValue = $("#cycleType").val() > 0 ? $("#cycleType").val() : 1;
					switch($("#cycleType").val()) {
						case "1":
							intervalValue = intervalValue * sValue;
							break;
						case "2":
							intervalValue = intervalValue * sValue * 60;
							break;
						case "3":
							intervalValue = intervalValue * sValue * 60 * 60;
							break;
					}

					var lastData = 11;
                    
					timeTicket = setTimeout(function() {
                       console.log(timeTicket)
						
                      socket1.send(tags);
					}, intervalValue);
				}

				
				
				socket1.onmessage = function(msg) {
					if(!msg.data) return;
					if(msg.data == "确认连接成功") return;

					var tagsArray = JSON.parse(msg.data);
					console.log(tagsArray);
					if(tagsArray.length==0)
					{
						shalert("此点没有数据，请选择其他点！");return false;
					}
					dataIndex = 0;
					lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
					lastData = lastData.toFixed(1) - 0;

					axisData = tagsArray[0].TimeStamp; // formatDate(new Date(), 0) + " " + (new Date()).toLocaleTimeString().replace(/^\D*/, '');

					var dataArray = new Array();
                    console.log(tagsArray)
					$.each(tagsArray, function(item, data) {
						/*if(item == 0) {*/
							dataArray.push(
								[
									item, // 系列索引
									data.Value, // 新增数据Math.round(Math.random() * 1000), // 新增数据
									false, // 新增数据是否从队列头部插入
									false, // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
									axisData // 坐标轴标签
								]
							);
						/*}*/ /*else {
							dataArray.push(
								[


									dataIndex, // 系列索引
									data.Value, //Math.round(Math.random() * 1000), // 新增数据
									false, // 新增数据是否从队列头部插入
									false, // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
									axisData // 坐标轴标签
								]);
						}*/
						
					});

					// 动态数据接口 addData
					myChart.addData(dataArray);

				}

			});

			/*历史趋势*/
			$("#btn_history").on("click", function() {
				socket1.close();
			    window.clearTimeout(timeTicket);
				historyLineFunction();

			});
			/*查询*/
			$("#bg_checkColl").on("click", function() {
				var pDescription = "";
				var pTagName = $("#input_name").val();
				var dataType = "DoubleFloat";
				send("AlarmTagInfo {\"username\":\"" + $.cookie("user") + "\",\"DataType\":\"" + dataType + "\",\"tagName\":\"" + pTagName + "\",\"Description\":\"" + pDescription + "\"}");

			});

			function historyLineFunction() {

				myChart.showLoading({
					text: "图表数据正在努力加载..."
				});
				window.clearTimeout(timeTicket);
				var sign = 0;

				var sign9 = 0;

				myChart.clear();
				if(sign9 == 0 && echartData.xAxisData.length > 0) {

					option.xAxis[0].data = echartData.xAxisData;
					option.series = echartData.seriesData;
					myChart.setOption(option);
				}
				myChart.hideLoading();
			}

			/*前进*/
			$("#btnGo").on("click", function() {

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
					historyLineFunction();

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
				/*一天*/
			$("#btnOneD").on("click", function() {
				$("#startTime").val($("#startTime").val().toString().split(' ')[0] + " 00：00：00");
				$("#endTime").val($("#startTime").val().toString().split(' ')[0] + " 23：59：59");

				$("#cycleValue").val("1");
				$("#cycleType").val("3");
				historyLineFunction();
			});
			/*保存笔组*/
			$("#btn_Savestrokegroup").click(function() {
				var strokeGroup = $("#input_strokegroup").val();

			});
			//删除笔组\n
			$("#btn_Delstrokegroup").click(function() {

			});
			//删除笔
			$("#btn_Delstroke").click(function() {

				if(trId != "") {
					if(tagGropList != null) {

						for(var i = 0; i < tagGropList.length; i++) {
							if(("tagGrop" + tagGropList[i]["id"]) == trId) {

								tagGropList.splice(i, 1);
							}
						}

						$("#" + trId).remove();

					}
				} else {
					shalert("请选择要删除的笔")
				}
			});

			/*end*/

			/*颜色配置*/
			$("#Ccolor").on("click", function() {

				if($(".rhTrendright_right").is(":hidden")) {
					if($(".rhTrendleft").is(":hidden")) {
						$(".rhTrendright").width("80%"); //如果元素为隐藏,则将它显现
					} else {
						$(".rhTrendright").width("60%"); //如果元素为隐藏,则将它显现
					}

					$(".rhTrendright_right").css('display', 'block');
				} else {
					if($(".rhTrendleft").is(":hidden")) {
						$(".rhTrendright").width("100%"); //如果元素为隐藏,则将它显现
					} else {
						$(".rhTrendright").width("80%"); //如果元素为隐藏,则将它显现
					}
					$(".rhTrendright_right").css('display', 'none');

				}
				myChart.resize();
			});
			/*点表列表 */
			$("#CList").on("click", function() {
				if($(".rhTrendleft").is(":hidden")) {
					if($(".rhTrendright_right").is(":hidden")) {
						$(".rhTrendright").width("80%");
					} else {
						$(".rhTrendright").width("60%");
					}

					$(".rhTrendleft").css('display', 'block');
				} else {
					if($(".rhTrendright_right").is(":hidden")) {
						$(".rhTrendright").width("100%");
					} else {
						$(".rhTrendright").width("80%");
					}
					$(".rhTrendleft").css('display', 'none');

				}
				myChart.resize();
			});
			/*选择列表*/
			$("#Ccheck").on("click", function() {

				if($(".rhTrendright_bottom").is(":hidden")) {
					$(".rhTrendright_middle").css("height", height * 0.35);
					$("#echarts_line").css("height", height * 0.32);

					$(".rhTrendright_bottom").css('display', 'block');
				} else {
					$("#echarts_line").css("height", height * 0.66);
					$(".rhTrendright_middle").css("height", height * 0.7);
					$(".rhTrendright_bottom").css('display', 'none');

				}
				myChart.resize();
			});

		});

	function tagListbind(datatable) {
		var str = "";

		if(datatable.length > 0) {

			$.each(datatable, function(index, data) {

				str += "<tr id=" + data["ID"] + " data-index=" + index + ">";
				str += "<td>" + data["Tagname"] + "</td>";
				str += "</tr>";
			});
		}

		return str;
	}
	/*tr 的点击事件*/
	function tagleftClick() {
		$(".rhTrendleft tbody tr").on("click", function() {

			$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style");
			if(isExist($(this).attr("ID"))) {
				/*页面动态加载*/
				[tagList[$(this).attr("data-index")]][0]["Color"] = colorArray[colorItem];
				$(".rhTrendright_bottom tbody").append(tagGropListbind([tagList[$(this).attr("data-index")]]));
				$(".rhTrendright_bottom tbody tr").click(function() {
					colorStyle($(this));
				});
				tagGropList.push(tagList[$(this).attr("data-index")]);
				colorItem++;
			}

		});

	}
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
	/*笔组点表关联数据加载*/
	function tagGropListbind(datatable) {
		var str = "";
		if(datatable != null) {
			$.each(datatable, function(index, data1) {

				str += "<tr id=tagGrop" + data1["ID"] + " data-index=" + index + " style='color:" + data1["Color"] + "'>";
				str += "<td>" + data1["Tagname"] + "</td>";
				str += "<td>" + data1["Description"] + "</td>";
				str += "</tr>";
			});
		}

		return str;
	}
	/*点击笔组关联tr*/
	$(".rhTrendright_bottom tbody tr").on("click", function() {

		//$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style","background-color: #DAF3F5");
		colorStyle($(this));
	});
	/*获取点击的id号，修改颜色*/
	function colorStyle(_this) {
		trId = _this.attr("ID");

		$('.demo').val(RGBToHex(_this.css("color")));
		$(".minicolors-swatch-color").attr("style", "background-color:" + _this.css("color"));
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

	//连接成功
	socket.onopen = function() {
		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}
		var pDescription = "";
		var pTagName = "";
		var dataType = "DoubleFloat";
		send("AlarmTagInfo {\"username\":\"" + $.cookie("user") + "\",\"DataType\":\"" + dataType + "\",\"tagName\":\"" + pTagName + "\",\"Description\":\"" + pDescription + "\"}");
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

				case "AlarmTagInfo":
					tagList = result["data"];
					console.log(tagList);
					$(".rhTrendleft tbody").html(tagListbind(result["data"]));
					tagleftClick();
					break;
			}
		}
	}

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