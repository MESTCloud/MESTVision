/*地图注记信息*/
var markerArr;

$(function() {
	/*添加按钮点击事件*/
	$("#btn_Add").click(function() {
		/*经纬度栏位设置不可用*/
		$("#longitude_Add").val("");
		document.getElementById("longitude_Add").disabled = true;

		$("#divDataList").hide();
		$("#divAddData").show();
		$("#divEditData").hide();
	});

	/*添加模块：取消按钮点击事件*/
	$("#Return_Add").click(function() {
		$("#divDataList").show();
		$("#divAddData").hide();
		$("#divEditData").hide();
	});

	/*修改模块：取消按钮点击事件*/
	$("#Return_Edit").click(function() {
		$("#divDataList").show();
		$("#divAddData").hide();
		$("#divEditData").hide();
	});

	/*添加区块:确定按钮点击事件*/
	$("#save_Add").click(function() {
		if($("#name_Add").val().trim() == "") {
			$("#name_Add").focus();
			shalert("名称不能为空！");
			return false;
		}
		if($("#longitude_Add").val().trim() == "") {
			$("#longitude_Add").focus();
			shalert("经纬度不能为空！");
			return false;
		}
		if($("#address_Add").val().trim() == "") {
			$("#address_Add").focus();
			shalert("地址不能为空！");
			return false;
		}
		if($("#link_Add").val().trim() == "") {
			$("#link_Add").focus();
			shalert("链接不能为空！");
			return false;
		}

		var jsStr = "AddMap {\"name\":\"" + $("#name_Add").val().trim() + "\",\"xyz\":\"" + $("#longitude_Add").val().trim() + "\",\"desc\":\"" + $("#address_Add").val().trim() + "\",\"url\":\"" + $("#link_Add").val().trim() + "\"}";
		send(jsStr);
	});
});

var map; //Map实例  
function map_init() {
	map = new BMap.Map("map");

	//第1步：设置地图中心点，广州市  
	//var point = new BMap.Point(113.312213, 23.147267);
	var point = new BMap.Point(105.238631,35.890566);

	//第2步：初始化地图,设置中心点坐标和地图级别。  
	map.centerAndZoom(point, 5);

	/*去掉道路显示*/
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
		document.getElementById("longitude_Add").disabled = false;
		document.getElementById("longitude_Add").value = e.point.lng + "," + e.point.lat;
		
		document.getElementById("longitude_Edit").value = e.point.lng + "," + e.point.lat;
	});
}

// 添加标注  
function addMarker(point, index) {
	var myIcon = new BMap.Icon("../img/markers.png",
		new BMap.Size(23, 25), {
			offset: new BMap.Size(10, 25),
			imageOffset: new BMap.Size(0, 0 - 11 * 25)
		});
	//myIcon.width = 10px;	
	var marker = new BMap.Marker(point, {
		icon: myIcon
	});
	map.addOverlay(marker);
	return marker;
}

// 添加信息窗口  
function addInfoWindow(marker, poi) {
	
	/*获取弹窗显示内容*/
	var infoWindow = GetinfoWindow(poi);

	var openInfoWinFun = function() {
		marker.openInfoWindow(infoWindow);
	};

	marker.addEventListener("click", openInfoWinFun);

	return openInfoWinFun;
}

/*获取弹窗显示内容*/
function GetinfoWindow(poi) {
	//pop弹窗标题  
	var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px">' + poi.name + '</div>';

	//pop弹窗信息  
	var html = [];
	html.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
	html.push('<tr>');
	html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all;padding-bottom: 5px;">地址:</td>');
	html.push('<td style="vertical-align:top;line-height:16px">' + poi.description + ' </td>');
	html.push('</tr>');
	html.push('<tr>');
	html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">链接:</td>');
	html.push('<td style="vertical-align:top;line-height:16px"><a href=' + poi.url + '>');
	html.push('<button type="button" ><span>详情</span></button></a></td>');
	html.push('</tr>');
	html.push('</tbody></table>');
	
	var infoWindow = new BMap.InfoWindow(html.join(""), {
		title: title,
		width: 100
	});
	
	return infoWindow;
}

//异步调用百度js  
function map_load() {
	var load = document.createElement("script");
	load.src = "http://api.map.baidu.com/api?v=2.0&ak=5dEsfUlwMV0GdHlxoqgvlxE0&callback=map_init";
	document.body.appendChild(load);
}

/*右边列表区块绑定*/
function bindTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {
			if(parseInt(index) / 2 == 0) {
				str += "<tr class='gradeX odd' role='row' data-value='" + index + "'>"
			} else {
				str += "<tr class='gradeX even' role='row' data-value='" + index + "'>"
			}
			str += "<td style='word-break: break-all; word-wrap:break-word;'>" + data["name"] + "</td>";
			str += "<td>";
			str += "<button type='button' class='btn btn-success btnEdit' style='padding: 3px 7px;'>";
			str += "<span>修改</span></button>";
			str += "</td>";
			str += "<td>";
			str += "<button type='button' class='btn btn-success btnDelete' data-value='" + data["id"] + "' style='padding: 3px 7px;'>";
			str += "<span>删除</span></button>";
			str += "</td>";
			str += "</tr>";
		});
	}

	return str;
}

// 修改事件
function EditFactoryData(pFactoryID) {
	$("#save_Edit").unbind("click");
	$("#save_Edit").click(function() {
		if($("#name_Edit").val().trim() == "") {
			$("#name_Edit").focus();
			shalert("名称不能为空！");
			return false;
		}
		if($("#longitude_Edit").val().trim() == "") {
			$("#longitude_Edit").focus();
			shalert("经纬度不能为空！");
			return false;
		}
		if($("#address_Edit").val().trim() == "") {
			$("#address_Edit").focus();
			shalert("地址不能为空！");
			return false;
		}
		if($("#link_Edit").val().trim() == "") {
			$("#link_Edit").focus();
			shalert("链接不能为空！");
			return false;
		}

		var jsStr = "ModifyMap {\"name\":\"" + $("#name_Edit").val().trim() + "\",\"xyz\":\"" + $("#longitude_Edit").val().trim() + "\",\"desc\":\"" + $("#address_Edit").val().trim() + "\",\"url\":\"" + $("#link_Edit").val().trim() + "\",\"id\":\"" + pFactoryID + "\"}";
		send(jsStr);
	});
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

				$("tbody").html(bindTable(result["data"]));

				/*table行点击事件:地图显示开窗*/
				$("tbody tr").click(function() {
					var pNum = $(this).attr("data-value");
					var p0 = markerArr[pNum]["xyz"].split(",")[0];
					var p1 = markerArr[pNum]["xyz"].split(",")[1];
					var maker = addMarker(new window.BMap.Point(p0, p1), i);
					var poi = markerArr[pNum];
					var infoWindow = GetinfoWindow(poi);
					maker.openInfoWindow(infoWindow);
				});

				/*修改按钮点击事件*/
				$(".btnEdit").click(function() {
					/*获取行索引值*/
					var pIndex = $(this).parent().parent().attr("data-value");
					
					/*获取注记ID*/
					var pFactoryID = markerArr[pIndex]["id"];
					$("#divDataList").hide();
					$("#divAddData").hide();
					$("#divEditData").show();

					$("#name_Edit").val(markerArr[pIndex]["name"]);
					$("#longitude_Edit").val(markerArr[pIndex]["xyz"]);
					$("#address_Edit").val(markerArr[pIndex]["description"]);
					$("#link_Edit").val(markerArr[pIndex]["url"]);

					EditFactoryData(pFactoryID);
				});

				/*删除按钮点击事件*/
				$(".btnDelete").click(function() {
					var pDelete = this.getAttribute("data-value");
					shconfirm("确定要删除吗", function(result) {
						if(result) {
							var jsStr = "DeleteMap {\"id\":\"" + pDelete + "\"}";
							console.log(jsStr);
							send(jsStr);
						}
					});
				});

				break;

			case "AddMap":
				shalert("添加成功");

				/*添加成功后清空栏位*/
				$("#name_Add").val("");
				$("#longitude_Add").val("");
				$("#address_Add").val("");
				$("#link_Add").val("");

				$("#divDataList").show();
				$("#divAddData").hide();
				$("#divEditData").hide();

				send("GetMapList");
				break;

			case "ModifyMap":
				shalert("修改成功");

				/*修改成功后清空栏位*/
				$("#name_Edit").val("");
				$("#longitude_Edit").val("");
				$("#address_Edit").val("");
				$("#link_Edit").val("");

				$("#divDataList").show();
				$("#divAddData").hide();
				$("#divEditData").hide();

				send("GetMapList");
				break;
			case "DeleteMap":
				shalert("删除成功");
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


/*获取经纬度*/
/*function searchByStationName() {

	var keyword = document.getElementById("text_").value;

	var localSearch = new BMap.LocalSearch(map);

	localSearch.setSearchCompleteCallback(function(searchResult) {
		var poi = searchResult.getPoi(0);
		document.getElementById("longitude_Add").value = poi.point.lng + "," + poi.point.lat;
		map.centerAndZoom(poi.point, 14);
		var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat)); // 创建标注，为要查询的地址对应的经纬度
		map.addOverlay(marker);
			var content = document.getElementById("text_").value + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
			var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
			marker.addEventListener("click", function() {
				this.openInfoWindow(infoWindow);
			}); 
		// marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	});
	localSearch.search(keyword);
}*/