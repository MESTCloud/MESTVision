var TreeData;
var $dataid;
var UITree = function() {

	var RoleMenu = function() {
		var treeObj = {};
		$('#tree_role').jstree({
			'plugins': ["checkbox", "types"],
			'core': {
				"themes": {
					"responsive": false
				},
				'data': TreeData
			},
			"types": {
				"default": {
					"icon": "fa fa-folder icon-state-warning icon-lg"
				},
				"file": {
					"icon": "fa fa-file icon-state-warning icon-lg"
				}
			}
		});
		$("#tree_role").bind("activate_node.jstree", function(obj, e) {
			var currentNode = e.node;
			treeObj = currentNode;

		});
		$('#tree_role').on("click.jstree", function(e) {
			console.log(treeObj);
			console.log(treeObj.id);
		});
		$("#role_save").on(function() {
			//点击保存时，将id 保存到库中
		});

	}

	$("#role_save").on("click", function() {
		console.log($dataid);
		var Array = [];
		//$("#tree_2").find("a").addClass("jstree-clicked");
		/*	if($dataid!=undefined)
			{
				console.log($("#tree_2").find("a .jstree-clicked"));
			}*/
		$.each($("#tree_role").find(".jstree-clicked").parent(), function(index, item) {
			Array.unshift(item.id);
			console.log(item.id);
		});
		var module = Array.join(',');
		var jsStr = "SetModuleForRole {\"id\":\"" + $dataid + "\",\"module\":\"" + module + "\"}";

		send(jsStr);
	});

	//连接成功
	socket.onopen = function() {

		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}

		send("RoleList");
		send("ModuleListByTree");
	}

	return {
		//main function to initiate the module
		init: function() {

			RoleMenu();

		}

	};

}();
var ChirdID;
if(App.isAngularJsApp() === false) {
	jQuery(document).ready(function() {
		/*用户数据绑定*/
		function bindUserTable(datatable) {
			if(datatable.length > 0) {
				var str = "";
				$.each(datatable, function(index, data) {

					str += "<tr class='gradeX even' role='row' data_Rid='" + data["RoleId"] + "'>"

					str += "<td>" + data["RealName"] + "</td>";
					str += "</tr>";

				});

			}

			return str;
		}
		/*点击角色列表 给菜单添加样式*/
			var active = function($id) {

			$("#" + $id).find("a:first").addClass("jstree-clicked");
			var count = 0;
			console.log($id);
			var $alist_length = $("#" + $id).siblings().length+1;//获取选中节点父节点的子节点的个数
			//console.log($alist_length);
			//console.log($("#" + $id).siblings().find("li a").html());
			for(var i = 0; i < $alist_length; i++) {
			/*	console.log($("#" + $id).parent().parent().find("li a").eq(i).html());*/
				if($("#" + $id).parent().parent().find("li a").eq(i).hasClass("jstree-clicked")) {
					count++;
				}
			}
			if(count == $alist_length) {
				$("#" + $id).parent().parent().find("a").addClass("jstree-clicked");
			} else {

				$("#" + $id).parent().parent().find("a:first").removeClass("jstree-clicked").children(":first").addClass("jstree-undetermined");

			}
			

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
					case "RoleList":
						console.log(result["data"]);
						/*页面加载*/
						$(".RoleMenu_left tbody").html(bindUserTable(result["data"]));
						/*角色的点击事件*/
						$(".RoleMenu_left  tbody tr").click(function() {
							$dataid = $(this).attr("data_Rid");
							console.log($dataid);
							$("#tree_role").find("a").removeClass("jstree-clicked");
							var jsStr = "ModuleListByRole {\"id\":\"" + $dataid + "\"}";
							send(jsStr);
						});

						break;

					case "ModuleListByTree":
					/*树绑定*/
						TreeData = result["data"];
						UITree.init();
						break;
					case "ModuleListByRole":
					/*获取角色集合*/
						var ary = result["info"].split(',');
						for(var i = 0; i < ary.length; i++) {
							active(ary[i]);
						}

						break;
					case "SetModuleForRole":
					/*保存*/
						shalert("保存成功");
						break;
				}

			}
		}

	});
}

//连接断开
socket.onclose = function(event) {
	console.log("Socket状态:" + readyStatus[socket.readyState]);
	//location.href = "http://www.baidu.com";
}

//发送
function send(msg) {
	socket.send(msg);
}

//断开连接
function disconnect() {
	socket.close();
}