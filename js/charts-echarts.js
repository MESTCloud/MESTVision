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
						boundaryGap: false,
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: '{value} °C'
						}
					}],
					series: [/*{
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
					},*/ {
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
					}]
				}

			);
			/*随浏览器的变化而变化*/
			window.onresize = function() {

				myChart2.resize(); //使第一个图表适应

			}

		}

	);
});