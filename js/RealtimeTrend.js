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
$(".rhTrendleft").css("height", height - 180);
$("#Dialog").css("height", height - 50);
$(".rhTrendright").css("height", height);
$(".rhTrendright_right").css("height", height);
$(".rhTrendright_top_top").css("height", "80px");
$(".rhTrendright_top").css("height", height * 0.1);
$(".rhTrendright_middle").css("height", height * 0.80);
$("#echarts_line").css("height", height * 0.75);
//$("#echarts_line").css("height", height * 0.41);
$("#rhTrendright_bottom").css("height", height * 0.20);
$(".rhTrendright_right_top").css("height", height);
var leftheight = $(".rhTrendleftTitle").height();
$(".rhTrendleft .portlet-body").css("height", height - leftheight);

//$("#divtable").css("height", pFrameHeight - pTitleHeight);

var tags = new Array();
jQuery(document).ready(function() {

	// ECHARTS
	require.config({
		paths: {
			echarts: '../resource/echarts/'
		}
	});

	// DEMOS
	require(
		[
			'echarts',
			'echarts/chart/line',
		],
		function(ec) {
			// --- 折线图 ---
			var myChart = ec.init(document.getElementById('echarts_line'));
			var option = {

				tooltip: {
					trigger: 'axis'
				},

				toolbox: {
					show: true,
					feature: {
						/*dataView: {
							show: true,
							readOnly: false
						},*/
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
			/*实时趋势*/
			//全局Socket对象

			var socket1;
			var readyStatus1 = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
			var host1 = "ws://36.110.66.3:29001";
			/*$("#btn_real").on('click', function() {

				real();
			});*/

			/*实时趋势*/
			function real() {
				if(tagGropList.length == 0) {
					shalert("请选择点！");
					return false;
				}
				if(socket1 != null) {
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

						$("#divAlarm").show();
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
								/*dataView: {
									show: true,
									readOnly: false
								},*/
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

					myChart.on("restore", function() {
						/*折线图显示*/
						real();

						$("#divAlarm").hide();
					});

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

						socket1.send(tags);
					}, intervalValue);
				}

				socket1.onmessage = function(msg) {
					if(!msg.data) return;
					if(msg.data == "确认连接成功") return;

					var tagsArray = JSON.parse(msg.data);

					if(tagsArray.length == 0) {
						shalert("此点没有数据，请选择其他点！");
						window.clearTimeout(timeTicket);
						if(socket1 != null) {
							socket1.close();
						}
						return false;
					}
					dataIndex = 0;
					lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
					lastData = lastData.toFixed(1) - 0;

					axisData = tagsArray[0].TimeStamp; // formatDate(new Date(), 0) + " " + (new Date()).toLocaleTimeString().replace(/^\D*/, '');

					var dataArray = new Array();

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
					});
					// 动态数据接口 addData
					myChart.addData(dataArray);
				}
			}

			/*添加标签区块的显示*/
			$('#myModalTend_Add').on('shown.bs.modal', function(e) {
				/*判断浏览器显示大小*/
				goPAGE();

				send("GetTagList");

			});
			$('#myModalTend_Add').on('hidden.bs.modal', function(e) {

				/*选中前清空历史数据*/
				//$("input[name='check_table']").prop('checked', false);
				//$(".rhTrendleft tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
			});

			/*判断浏览器*/
			function goPAGE() {
				if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
					$(".div1 .portlet-body").css("height", pFrameHeight - 230);

					window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
						if(window.orientation === 180 || window.orientation === 0) {
							var height = window.screen.height;

							$(".div1 .portlet-body").css("height", height - 50); //.width(height);
						}
						if(window.orientation === 90 || window.orientation === -90) {

							var height = window.screen.width;

							$(".div1 .portlet-body").css("height", height); //.width("550px");
						}
					}, false);

				} else {
					$(".div1 .portlet-body").css("height", pFrameHeight * 0.6);
				}
			}

			$("#user_close").on("click", function() {
				socket1.close();
			});

			/*添加标签区块：查询按钮点击事件*/
			$("#bg_checkColl").on("click", function() {
				$("#myModalTend_Add tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
				var jsStr = "SelectTagList {\"name\":\"" + $("#input_name").val().trim() + "\"}";

				send(jsStr);

			});

			/*添加标签模块：确定按钮事件*/
			$("#close_Check").click(function() {
				$('#myModalTend_Add').modal('hide');

				/*折线图显示*/
				real();

				if(tagGropList.length > 0) {

					$("#rhTrendright_bottom").show();
					$("#li_savegroup1").show();
					$("#li_savegroup2").show();
				} else {
					$("#li_savegroup1").hide();
					$("#li_savegroup2").hide();
				}
			});

			/*保存笔组区块：确定按钮点击事件*/
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

			/*选择笔組列表模块:确定按钮事件*/
			$("#btn_input").on("click", function() {

				//selectGroup();

				var jsStr = "SelectGroup {\"id\":\"" + $("#input_strokegrouplist").val().trim() + "\"}";
				send(jsStr);

			});

			/*笔组切换*/
			/*function selectGroup() {

				var jsStr = "SelectGroup {\"id\":\"" + $("#input_strokegrouplist").val().trim() + "\"}";
				send(jsStr);
			}*/

			/*删除笔组列表区块:确定按钮点击事件*/
			$("#btn_Delstrokegroup").click(function() {
				var strokeGroup = $("#delete_strokegrouplist").val().trim();

				if(strokeGroup == "") {
					shalert("请选择笔组名称");
					return false;
				} else {
					shconfirm("确定要删除吗？", function(result) {
						if(result) {
							var jsStr = "DeleteGroup {\"id\":\"" + strokeGroup + "\"}";

							send(jsStr);
						}
					});
				}
			});

			/*显示隐藏列表按钮点击事件*/
			$("#Ccheck").on("click", function() {

				if($("#rhTrendright_bottom").is(":hidden")) {

					$(".rhTrendright_middle").css("height", height * 0.8);
					$("#echarts_line").css("height", height * 0.75);

					$("#rhTrendright_bottom").css('display', 'block');

					$("#Ccheck").text(" 隐藏列表");
					$("#Ccheck").prepend("<i class='fa fa-flash'></i>");

				} else {

					$("#echarts_line").css("height", height * 0.85);
					$(".rhTrendright_middle").css("height", height * 0.9);
					$("#rhTrendright_bottom").css('display', 'none');

					$("#Ccheck").text(" 显示列表");
					$("#Ccheck").prepend("<i class='fa fa-flash'></i>");


				}
				myChart.resize();
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

			//删除标签
			function deletegroup(trId) {
				if(trId != "") {
					/*shconfirm("确定要删除吗？", function(result) {*/
					/*if(result) {*/
					if(tagGropList != null) {
						for(var i = 0; i < tagGropList.length; i++) {
							if(("tagGrop" + tagGropList[i]["ID"]) == trId) {
								tagGropList.splice(i, 1);
							}
						}

						$("#" + trId).remove();
						//shalert("删除成功！");
					}
					/*}*/
					/*});*/

				} else {
					shalert("请选择要删除的笔")
				}
			}

			/*颜色配置按钮点击事件*/
			$("#Ccolor").on("click", function() {

				if($(".rhTrendright_right").is(":hidden")) {
					if($("#myModalTend_Add").is(":hidden")) {
						$(".rhTrendright").width("84%"); //如果元素为隐藏,则将它显现
					} else {
						$(".rhTrendright").width("69%"); //如果元素为隐藏,则将它显现
					}

					$(".rhTrendright_right").css('display', 'block');
				} else {
					if($("#myModalTend_Add").is(":hidden")) {
						$(".rhTrendright").width("100%"); //如果元素为隐藏,则将它显现
					} else {
						$(".rhTrendright").width("84%"); //如果元素为隐藏,则将它显现
					}
					$(".rhTrendright_right").css('display', 'none');

				}
				myChart.resize();
			});

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
								$("#rhTrendright_bottom tbody").html(tagGropListbind(tagGropList));
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

			/*点击笔组关联tr*/
			function bottomtr() {

				$("#rhTrendright_bottom tbody tr").on("click", function() {

					$(this).css("backgroundColor", "#DAF3F5").siblings().css("backgroundColor", "");
					colorStyle($(this));

				});
			}

			/*获取点击的id号，修改颜色*/
			function colorStyle(_this) {
				trId = _this.attr("ID");

				$('.demo').val(RGBToHex(_this.css("color")));
				$(".minicolors-swatch-color").attr("style", "background-color:" + _this.css("color"));

				bottomtr();
				Ccolor();
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

			/*颜色配置*/
			function Ccolor() {
				$(".Ccolor").on("click", function() {

					if($(".rhTrendright_right").is(":hidden")) {
						$(".rhTrendright").width("84%"); //如果元素为隐藏,则将它显现

						$(".rhTrendright_right").css('display', 'block');
					}

					myChart.resize();

				});
			}

			/*颜色配置关闭*/
			$("#btn_Color").on("click", function() {
				$(".rhTrendright_right").css('display', 'none');
				$(".rhTrendright").width("100%");

				myChart.resize();
			});

			/*标签表table绑定*/
			function tagListbind(datatable) {
				var str = "";
				if(datatable.length > 0) {
					$.each(datatable, function(index, data) {

						str += "<tr id=" + data["ID"] + "  data-index='" + index + "' class='tr1'>";
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

			/*tr 的点击事件*/
			function tagleftClick() {
				$("#myModalTend_Add tbody tr input").on("click", function() {
					var truey = $(this).find('input[name=check_table]').context.checked;
					$(this).attr("style", "background-color: #DAF3F5").siblings().removeAttr("style");
					if(truey) {

						if(isExist("tagGrop" + $(this).attr("ID"))) {
							/*页面动态加载*/
							[tagList[$(this).attr("data-index")]][0]["Color"] = colorArray[colorItem];
							$("#rhTrendright_bottom tbody").append(tagGropListbind([tagList[$(this).attr("data-index")]]));
							$(".delgrop").click(function() {
								var trId = "tagGrop" + $(this).attr("data-value");
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
												shalert("删除成功！");
											}
										}
									});

								} else {
									shalert("请选择要删除的笔")
								}

								//deletegroup("tagGrop" + $(this).attr("data-value"));
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

			/*笔组列表加载*/
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
				console.log(str);
			}

			/*笔组点表table数据加载*/
			function tagGropListbind(datatable) {
				var str = "";
				if(datatable != null) {
					$.each(datatable, function(index, data1) {

						str += "<tr id=tagGrop" + data1["ID"] + " style='color:" + data1["Color"] + "' class='tr1'>";
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

			/*获取笔组点*/
			/*function GroupList(strokeid) {
				var dataList = [];

				$.each(tagList, function(index, data) {

					if(data["ID"] === strokeid) {

						dataList.push(data);
					}

				});

				return dataList;

			}*/

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

				send("GetGroupList");
				$("#myModalTend_Add tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
			}

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
							//console.log(tagList);
							$("#myModalTend_Add tbody").html(tagListbind(result["data"]));

							/*tr 的点击事件*/
							tagleftClick();
							break;
						case "SelectTagList":
							tagList = result["data"];
							$("#myModalTend_Add tbody").html(tagListbind(result["data"]));

							/*tr 的点击事件*/
							tagleftClick();
							break;
						case "GetGroupList":
							strokeGroupList = result["data"];
							$("#input_strokegrouplist").html(strokeGroupbind(strokeGroupList));
							$("#delete_strokegrouplist").html(strokeGroupbind(strokeGroupList));
							break;
						case "SelectGroup":
							var strokeGroup = result["data"];
							tagGropList = [];
							$.each(strokeGroup, function(index, data) {
								if(isExist(data["ID"])) {
									tagGropList.push(data);
								}
							});
							$("#rhTrendright_bottom tbody").html(tagGropListbind(tagGropList));

							bottomtr();
							Ccolor();

							/*关闭选择笔組列表区块,显示折线图*/
							$('#myStrokegroup_List').modal('hide');

							$("#input_strokegrouplist").val("");

							$("#rhTrendright_bottom").show();
							/*获取折线图*/
							real();

							break;
						case "AddGroup":
							shalert("添加成功！");
							$('#myStrokegroup_Add').modal('hide');
							$("#input_strokegroup").val("");
							send("GetGroupList");
							break;
						case "DeleteGroup":
							shalert(result["info"]);
							$('#myStrokegroup_Drop').modal('hide');
							send("GetGroupList");
							$("#rhTrendright_bottom tbody").html("");
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
});