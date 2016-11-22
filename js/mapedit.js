var type;

var markerArr;

$(function() {
	//map_load();
	$("#delete_Add").hide();
	$("#save_Add").click(function() {
		if($("#name_Add").val().trim() == "") {
			shalert("名称不能为空！");
			$("#name_Add").focus();
			return false;
		}
		if($("#longitude_Add").val().trim() == "") {
			shalert("经纬度不能为空！");
			$("#longitude_Add").focus();
			return false;
		}
		if($("#address_Add").val().trim() == "") {
			shalert("地址不能为空！");
			$("#address_Add").focus();
			return false;
		}
		if($("#link_Add").val().trim() == "") {
			shalert("链接不能为空！");
			$("#link_Add").focus();
			return false;
		}
		/*修改*/
		if(type == "edit") {

			var jsStr = "UpdateUser {\"id\":\"" + userid + "\",\"realname\":\"" + $("#name_Update").val().trim() + "\",\"mobile\":\"" + $("#inputphone_Update").val().trim() + "\",\"role\":\"" + $("#select_role_update").val().trim() + "\"}";

			//send(jsStr);

		} else { //新增
			var jsStr = "AddMap {\"name\":\"" + $("#name_Add").val().trim() + "\",\"xyz\":\"" + $("#longitude_Add").val().trim() + "\",\"desc\":\"" + $("#address_Add").val().trim() + "\",\"url\":\"" + $("#link_Add").val().trim() + "\"}";
			console.log(jsStr);
			send(jsStr);
		}

	});

	/*清除按钮点击事件*/
	$("#clear_Add").click(function() {
		/*名称*/
		$("#name_Add").val("");
		/*经纬度*/
		$("#longitude_Add").val("");
		/*地址*/
		$("#address_Add").val("");
		/*链接*/
		$("#link_Add").val("");
	});

	/*删除按钮点击事件*/
	$("#delete_Add").click(function() {
		shconfirm("确定要删除吗", function(result) {
			if(result) {
				var jsStr = "DeleteMap {\"name\":\"" + $("#name_Add").val().trim() + "\"}";
				console.log(jsStr);
				send(jsStr);
			}
		});
	});
});

/*var markerArr = [{
	title: "峨眉山",
	point: "103.352223, 29.573007",
	address: "四川省峨眉山市名山西路46号",
	tel: "18500000000",
	linkaddres: "SVGAnalysis.html?name=AHHX_008"
}, {
	title: "苹果专卖店(三里屯店)",
	point: "116.460982, 39.940673",
	address: "北京市朝阳区三里屯路19号院",
	tel: "12306",
	linkaddres: "SVGAnalysis.html?name=AHHX_002"

}, {
	title: "农夫山泉红河谷工厂",
	point: "107.774868, 34.165504",
	address: "陕西省宝鸡市 ",
	tel: "18500000000",
	linkaddres: "SVGAnalysis.html?name=AHHX_003"
}];*/

var map; //Map实例  
function map_init() {
	map = new BMap.Map("map");

	//第1步：设置地图中心点，广州市  
	//var point = new BMap.Point(113.312213, 23.147267);
	var point = new BMap.Point(116.460982, 39.940673);

	//第2步：初始化地图,设置中心点坐标和地图级别。  
	map.centerAndZoom(point, 5);

	/*var tilelayer = new BMap.TileLayer(); // 创建地图层实例    
	tilelayer.getTilesUrl = function() { // 设置图块路径     
		return "layer.gif";
	};
	map.addTileLayer(tilelayer);*/

	/*去掉道路*/
	map.setMapStyle({
		styleJson: [{
			"featureType": "highway",
			"elementType": "all",
			"stylers": {
				"visibility": "off"
			}
		}]
	});

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
		var p0 = markerArr[i].xyz.split(",")[0];
		var p1 = markerArr[i].xyz.split(",")[1];
		var maker = addMarker(new window.BMap.Point(p0, p1), i);
		addInfoWindow(maker, markerArr[i], i);
	}

	//右击获取屏幕经纬度
	map.addEventListener("rightclick", function(e) {
		document.getElementById("longitude_Add").value = e.point.lng + "," + e.point.lat;
	});
}

/*获取经纬度*/
function searchByStationName() {

	var keyword = document.getElementById("text_").value;

	var localSearch = new BMap.LocalSearch(map);

	localSearch.setSearchCompleteCallback(function(searchResult) {
		var poi = searchResult.getPoi(0);
		document.getElementById("longitude_Add").value = poi.point.lng + "," + poi.point.lat;
		map.centerAndZoom(poi.point, 14);
		var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat)); // 创建标注，为要查询的地址对应的经纬度
		map.addOverlay(marker);
		/*	var content = document.getElementById("text_").value + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
			var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
			marker.addEventListener("click", function() {
				this.openInfoWindow(infoWindow);
			}); */
		// marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	});
	localSearch.search(keyword);
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
	var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px">' + poi.name + '</div>';

	//pop弹窗信息  
	var html = [];
	html.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
	html.push('<tr>');
	html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">地址:</td>');
	html.push('<td style="vertical-align:top;line-height:16px">' + poi.description + ' </td>');
	html.push('</tr>');
	html.push('<tr>');
	html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">链接:</td>');
	html.push('<td style="vertical-align:top;line-height:16px"><a href=' + poi.url + ' >' + poi.url + '</a></td>');
	html.push('</tr>');
	html.push('</tbody></table>');
	var infoWindow = new BMap.InfoWindow(html.join(""), {
		title: title,
		width: 200
	});

	var openInfoWinFun = function() {
		type = "edit";

		/*显示删除按钮*/
		$("#delete_Add").show();

		/*文本框获取数据*/
		$("#name_Add").val(poi.name);
		$("#longitude_Add").val(poi.xyz);
		/*$("#latitude_Add").val(poi.xyz);*/
		$("#address_Add").val(poi.description);
		$("#link_Add").val(poi.url);

		marker.openInfoWindow(infoWindow);
	};

	marker.addEventListener("click", openInfoWinFun);

	return openInfoWinFun;
}

//异步调用百度js  
function map_load() {
	var load = document.createElement("script");
	load.src = "http://api.map.baidu.com/api?v=2.0&ak=5dEsfUlwMV0GdHlxoqgvlxE0&callback=map_init";
	document.body.appendChild(load);
}

//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}

	send("GetMapList");
}

//收到消息
socket.onmessage = function(msg) {

	var result = msg.data;
	result = JSON.parse(result);

	if(result["error"]) {
		shalert(result["error"]);
	}
	/*else if(result["exception"]) {
		shalert(result["exception"]);
	} */
	else {
		switch(result["Function"]) {

			case "GetMapList":

				markerArr = result["data"];
				map_load();
				break;

			case "AddMap":
				shalert("新增成功");

				send("GetMapList");

				console.log(markerArr);
				break;
			case "DeleteMap":

				shalert("删除成功");

				/*名称*/
				$("#name_Add").val("");
				/*经纬度*/
				$("#longitude_Add").val("");
				/*地址*/
				$("#address_Add").val("");
				/*链接*/
				$("#link_Add").val("");

				send("GetMapList");

				break;

		}
	}
}

//连接断开
socket.onclose = function(event) {
	console.log("Socket状态:" + readyStatus[socket.readyState]);
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