var Dashboard = function() {
	return {
		
		initCharts: function() {
			function e(e, t, a, i) {
				$('<div id="tooltip" class="chart-tooltip">' + i + "</div>").css({
					position: "absolute",
					display: "none",
					top: t - 40,
					left: e - 40,
					border: "0px solid #ccc",
					padding: "2px 6px",
					"background-color": "#fff"
				}).appendTo("body").fadeIn(200)
			}
			if(jQuery.plot) {
				var t = [
					["01/2013", 1000],
					["02/2013", 1500],
					["03/2013", 2500],
					["04/2013", 1700],
					["05/2013", 800],
					["06/2013", 1500],
					["07/2013", 2350],
					["08/2013", 1500],
					["09/2013", 1300],
					["10/2013", 4600],
					["11/2013", 3600],
					["12/2013", 2000]
				];
				if(0 != $("#site_statistics").size()) {
					$("#site_statistics_loading").hide(), $("#site_statistics_content").show();
					var a = ($.plot($("#site_statistics"), [{
						data: t,
						lines: {
							fill: .6,
							lineWidth: 0
						},
						color: ["#f89f9f"]
					}, {
						data: t,
						points: {
							show: !0,
							fill: !0,
							radius: 5,
							fillColor: "#f89f9f",
							lineWidth: 3
						},
						color: "#fff",
						shadowSize: 0
					}], {
						xaxis: {
							tickLength: 0,
							tickDecimals: 0,
							mode: "categories",
							min: 0,
							font: {
								lineHeight: 14,
								style: "normal",
								variant: "small-caps",
								color: "#6F7B8A"
							}
						},
						yaxis: {
							ticks: 5,
							tickDecimals: 0,
							tickColor: "#eee",
							font: {
								lineHeight: 14,
								style: "normal",
								variant: "small-caps",
								color: "#6F7B8A"
							}
						},
						grid: {
							hoverable: !0,
							clickable: !0,
							tickColor: "#eee",
							borderColor: "#eee",
							borderWidth: 1
						}
					}), null);
					$("#site_statistics").bind("plothover", function(t, i, l) {
						if($("#x").text(i.x.toFixed(2)), $("#y").text(i.y.toFixed(2)), l) {
							if(a != l.dataIndex) {
								a = l.dataIndex, $("#tooltip").remove();
								l.datapoint[0].toFixed(2), l.datapoint[1].toFixed(2);
								e(l.pageX, l.pageY, l.datapoint[0], l.datapoint[1] + " visits")
							}
						} else $("#tooltip").remove(), a = null
					})
				}
				if(0 != $("#site_activities").size()) {
					var i = null;
					$("#site_activities_loading").hide(), $("#site_activities_content").show();
					var l = [
						["DEC", 300],
						["JAN", 600],
						["FEB", 1100],
						["MAR", 1200],
						["APR", 860],
						["MAY", 1200],
						["JUN", 1450],
						["JUL", 1800],
						["AUG", 1200],
						["SEP", 600]
					];
					$.plot($("#site_activities"), [{
						data: l,
						lines: {
							fill: .2,
							lineWidth: 0
						},
						color: ["#BAD9F5"]
					}, {
						data: l,
						points: {
							show: !0,
							fill: !0,
							radius: 4,
							fillColor: "#9ACAE6",
							lineWidth: 2
						},
						color: "#9ACAE6",
						shadowSize: 1
					}, {
						data: l,
						lines: {
							show: !0,
							fill: !1,
							lineWidth: 3
						},
						color: "#9ACAE6",
						shadowSize: 0
					}], {
						xaxis: {
							tickLength: 0,
							tickDecimals: 0,
							mode: "categories",
							min: 0,
							font: {
								lineHeight: 18,
								style: "normal",
								variant: "small-caps",
								color: "#6F7B8A"
							}
						},
						yaxis: {
							ticks: 5,
							tickDecimals: 0,
							tickColor: "#eee",
							font: {
								lineHeight: 14,
								style: "normal",
								variant: "small-caps",
								color: "#6F7B8A"
							}
						},
						grid: {
							hoverable: !0,
							clickable: !0,
							tickColor: "#eee",
							borderColor: "#eee",
							borderWidth: 1
						}
					});
					$("#site_activities").bind("plothover", function(t, a, l) {
						if($("#x").text(a.x.toFixed(2)), $("#y").text(a.y.toFixed(2)), l && i != l.dataIndex) {
							i = l.dataIndex, $("#tooltip").remove();
							l.datapoint[0].toFixed(2), l.datapoint[1].toFixed(2);
							e(l.pageX, l.pageY, l.datapoint[0], l.datapoint[1] + "M$")
						}
					}), $("#site_activities").bind("mouseleave", function() {
						$("#tooltip").remove()
					})
				}
			}
		},
	
	init: function() {
			 this.initCharts()
		}
	}
}();
App.isAngularJsApp() === !1 && jQuery(document).ready(function() {
	Dashboard.init()
});