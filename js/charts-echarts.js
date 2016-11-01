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

			// --- LINE ---
			var myChart2 = ec.init(document.getElementById('echarts_line'));
			myChart2.setOption({
					title: {
						text: '',
						subtext: ''
					},
					tooltip: {
						trigger: 'axis'
					},
					/* legend: {
					     data: ['High', 'Low']
					 },*/
					toolbox: {
						show: true,
						feature: {
							dataView: {
								show: true,
								readOnly: false,
								title: "数据视图"
							},
						
							restore: {
								show: true,
								title: "还原"
							},
							saveAsImage: {
								show: true,
								title: "保存为图片"
							}
						}
					},
					calculable: true,
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
						axisLabel: {
							formatter: '{value} °C'
						}
					}],
					series: [
						/*{
												name: 'High',
												type: 'line',
												data: [11, 11, 15, 13, 12, 13, 10],
												markPoint: {
													data: [{
														type: 'max',
														name: 'Max'
													}, {
														type: 'min',
														name: 'Min'
													}]
												},
												markLine: {
													data: [{
														type: 'average',
														name: 'Mean'
													}]
												}
											},*/
						{
							name: 'Low',
							type: 'line',
							data: [1, -2, 2, 5, 3, 2, 0],
							markPoint: {
								data: [{
									name: 'Lowest',
									value: -2,
									xAxis: 1,
									yAxis: -1.5
								}]
							},
							markLine: {
								data: [{
									type: 'average',
									name: 'Mean'
								}]
							}
						}
					]
				}

			);
			/*随浏览器的变化而变化*/
			window.onresize = function() {

				myChart2.resize(); //使第一个图表适应

			}

		}

	);
	//时间初始化

	var sDate = new Date();
	$("#startTime").val(formatDate(sDate) + " 08：00：00");
	$("#endTime").val(formatDate(sDate) + " 08：00：10");
	/*前进*/
	$("#btnGo").on("click", function() {

		})
		/*后退*/
	$("#btnBack").on("click", function() {

		})
		/*早班*/
	$("#btnZShift").on("click", function() {

		})
		/*中班*/
	$("#btnMShift").on("click", function() {

		})
		/*晚班*/
	$("#btnHShift").on("click", function() {

		})
		/*一天*/
	$("#btnOneD").on("click", function() {

	})

	/*颜色配置*/
	$("#Ccolor").on("click", function() {
		console.log($("#hue-demo").val());
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
	});
	/*选择列表*/
	$("#Ccheck").on("click", function() {
		if($(".rhTrendright_bottom").is(":hidden")) {
			$(".rhTrendright_middle").height("250px");

			$(".rhTrendright_bottom").css('display', 'block');
		} else {

			$(".rhTrendright_middle").height("450px");
			$(".rhTrendright_bottom").css('display', 'none');

		}
	});
});