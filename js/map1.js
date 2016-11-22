$(function() {
	var markerArr = [{
			title: "名称：广州火车站",
			point: "113.264531,23.157003",
			address: "广东省广州市广州火车站",
			tel: "12306"
		}, {
			title: "名称：广州塔（赤岗塔）",
			point: "113.330934,23.113401",
			address: "广东省广州市广州塔（赤岗塔） ",
			tel: "18500000000"
		}, {
			title: "名称：广州动物园",
			point: "113.312213,23.147267",
			address: "广东省广州市广州动物园",
			tel: "18500000000"
		}, {
			title: "名称：天河公园",
			point: "113.372867,23.134274",
			address: "广东省广州市天河公园",
			tel: "18500000000"
		}

	];

	var map = new BMap.Map("allmap"); // 创建地图实例
	var point = new BMap.Point(113.312213, 23.147267); // 创建点坐标
	map.centerAndZoom(point, 15);

	map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
	map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
	map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
	map.enableKeyboard(); //启用键盘上下左右键移动地图

	var ctrl_nav = new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_TOP_LEFT,
		type: BMAP_NAVIGATION_CONTROL_LARGE
	});
	map.addControl(ctrl_nav);
	//向地图中添加缩略图控件
	var ctrl_ove = new BMap.OverviewMapControl({
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		isOpen: 1
	});
	map.addControl(ctrl_ove);
	//向地图中添加比例尺控件
	var ctrl_sca = new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_BOTTOM_LEFT
	});
	map.addControl(ctrl_sca);

	var point = new Array(); //存放标注点经纬信息的数组  
	var marker = new Array(); //存放标注点对象的数组  
	var info = new Array(); //存放提示信息窗口对象的数组

	for(var i = 0; i < markerArr.length; i++) {
		var p0 = markerArr[i].point.split(",")[0]; //  
		var p1 = markerArr[i].point.split(",")[1]; //按照原数组的point格式将地图点坐标的经纬度分别提出来  
		point[i] = new window.BMap.Point(p0, p1); //循环生成新的地图点  
		marker[i] = new window.BMap.Marker(point[i]); //按照地图点坐标生成标记  
		map.addOverlay(marker[i]);
		/*marker[i].setAnimation(BMAP_ANIMATION_BOUNCE); */ //跳动的动画  
		var label = new window.BMap.Label(markerArr[i].title, {
			offset: new window.BMap.Size(20, -10)
		});
		marker[i].setLabel(label);
		info[i] = new window.BMap.InfoWindow("<p style=’font-size:12px;lineheight:1.8em;’>" + markerArr[i].title + "</br>地址：" + markerArr[i].address + "</br> 电话：" + markerArr[i].tel + "</br></p>"); // 创建信息窗口对象 
	}

	marker[0].addEventListener("mouseover", function() {
		this.openInfoWindow(info[0]);
	});
	marker[1].addEventListener("mouseover", function() {
		this.openInfoWindow(info[1]);
	});
	marker[2].addEventListener("mouseover", function() {
		this.openInfoWindow(info[2]);
	});
})