$(function() {
	map_load();
});

var markerArr = [{
		/*title: "名称：广州火车站",
		point: "113.264531,23.157003",
		address: "广东省广州市广州火车站",
		tel: "12306",
		linkaddres: "SVGAnalysis.html?name=AHHX_002"*/
		title: "名称：峨眉山",
		point: "103.352223, 29.573007",
		address: "四川省峨眉山市名山西路46号",
		tel: "18500000000",
		linkaddres: "SVGAnalysis.html?name=AHHX_008"
	}, {
		/*title: "名称：广州动物园",
		point: "113.312213,23.147267",
		address: "广东省广州市广州动物园",
		tel: "18500000000",
		linkaddres: "SVGAnalysis.html?name=AHHX_008"*/
		title: "名称：苹果专卖店(三里屯店)",
		point: "116.460982, 39.940673",
		address: "北京市朝阳区三里屯路19号院",
		tel: "12306",
		linkaddres: "SVGAnalysis.html?name=AHHX_002"
		
	}, {
		/*title: "名称：广州塔（赤岗塔）",
		point: "113.330934,23.113401",
		address: "广东省广州市广州塔（赤岗塔） ",
		tel: "18500000000",
		linkaddres: "SVGAnalysis.html?name=AHHX_003"*/
		title: "名称：农夫山泉红河谷工厂",
		point: "107.774868, 34.165504",
		address: "陕西省宝鸡市 ",
		tel: "18500000000",
		linkaddres: "SVGAnalysis.html?name=AHHX_003"
	},
	/*{
		title: "名称：天河公园",
		point: "113.372867,23.134274",
		address: "广东省广州市天河公园",
		tel: "18500000000"
	}*/
];

var map; //Map实例  
function map_init() {
	map = new BMap.Map("map");

	//第1步：设置地图中心点，广州市  
	//var point = new BMap.Point(113.312213, 23.147267);
	var point = new BMap.Point(116.460982, 39.940673);

	//第2步：初始化地图,设置中心点坐标和地图级别。  
	map.centerAndZoom(point, 5);

	//第3步：启用滚轮放大缩小  
	map.enableScrollWheelZoom(true);

	//第4步：向地图中添加缩放控件  
	var ctrlNav = new window.BMap.NavigationControl({
		anchor: BMAP_ANCHOR_TOP_LEFT,
		type: BMAP_NAVIGATION_CONTROL_LARGE
	});
	map.addControl(ctrlNav);

	//第5步：向地图中添加缩略图控件  
	var ctrlOve = new window.BMap.OverviewMapControl({
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		isOpen: 1
	});
	map.addControl(ctrlOve);

	//第6步：向地图中添加比例尺控件  
	var ctrlSca = new window.BMap.ScaleControl({
		anchor: BMAP_ANCHOR_BOTTOM_LEFT
	});
	map.addControl(ctrlSca);

	//第7步：绘制点    
	for(var i = 0; i < markerArr.length; i++) {
		var p0 = markerArr[i].point.split(",")[0];
		var p1 = markerArr[i].point.split(",")[1];
		var maker = addMarker(new window.BMap.Point(p0, p1), i);
		addInfoWindow(maker, markerArr[i], i);
	}
}

// 添加标注  
function addMarker(point, index) {
	var myIcon = new BMap.Icon("../img/markers.png",
		new BMap.Size(23, 25), {
			offset: new BMap.Size(10, 25),
			imageOffset: new BMap.Size(0, 0 - index * 25)
		});
	var marker = new BMap.Marker(point, {
		icon: myIcon
	});
	map.addOverlay(marker);
	return marker;
}

// 添加信息窗口  
function addInfoWindow(marker, poi) {
	
	//pop弹窗标题  
	var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px">' + poi.title + '</div>';

	//pop弹窗信息  
	var html = [];
	html.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
	html.push('<tr>');
	html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">地址:</td>');
	html.push('<td style="vertical-align:top;line-height:16px">' + poi.address + ' </td>');
	html.push('</tr>');
	html.push('<tr>');
	html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">链接:</td>');
	html.push('<td style="vertical-align:top;line-height:16px"><a href=' + poi.linkaddres + ' >' + poi.linkaddres + '</a></td>');
	html.push('</tr>');
	html.push('</tbody></table>');
	var infoWindow = new BMap.InfoWindow(html.join(""), {
		title: title,
		width: 200
	});

	var openInfoWinFun = function() {
		marker.openInfoWindow(infoWindow);
	};
	
	marker.addEventListener("click", openInfoWinFun);
	return openInfoWinFun;
}

//异步调用百度js  
function map_load() {
	var load = document.createElement("script");
	load.src = "http://api.map.baidu.com/api?v=1.4&callback=map_init";
	document.body.appendChild(load);
}