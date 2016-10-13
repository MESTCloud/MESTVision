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

		}
		/*保存按钮*/
	$("#role_save").on("click", function() {

		var Array = [];
		var UndaterArray = [];

		if($dataid != undefined) {

			$.each($("#tree_role").find(".jstree-undetermined").parent().parent(), function(index, item) {
				UndaterArray.unshift(item.id)
			});
			$.each($("#tree_role").find(".jstree-clicked").parent(), function(index, item) {
				Array.unshift(item.id);

			});

			var module = UndaterArray.concat(Array).join(',');
			var jsStr = "SetModuleForRole {\"id\":\"" + $dataid + "\",\"module\":\"" + module + "\"}";

			send(jsStr);
		} else {
			shalert("请选择角色");
			return false;
		}
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

		//首先判断当前这个id 是否有子集，如果没有子集  添加对勾样式；  如果有子集，判断子集的个数，和子集选中的个数，如果个数相等添加对勾的样式 ，不相等 半选中
		/*点击用户列表 给菜单添加样式*/
		var active = function($id) {

			if($("#" + $id).find(">ul").length > 0) {
				//获取当前元素中子集的个数
				var childLength = $("#" + $id).find(">ul").children().length;
				/*查找选中的个数*/
				var count = 0;
				for(var i = 0; i < childLength; i++) {
					/*判断每个子集*/
					if($("#" + $id).find(">ul").children().find("> a").eq(i).hasClass("jstree-clicked")) {
						count++;

					}

				}
				if(count == childLength) {
					$("#" + $id).find("a:first").addClass("jstree-clicked");
				} else {
					$("#" + $id).find("a:first").removeClass("jstree-clicked").children(":first").addClass("jstree-undetermined");
				}

			} else {
				$("#" + $id).find("a:first").addClass("jstree-clicked");
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
						
						/*页面加载*/
						$(".RoleMenu_left tbody").html(bindUserTable(result["data"]));
						/*角色的点击事件*/
						$(".RoleMenu_left  tbody tr").click(function() {
							$dataid = $(this).attr("data_Rid");
							$("#tree_role").find('.jstree-undetermined').removeClass('jstree-undetermined');
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
							$("#" + ary[i]).find("a:first").addClass("jstree-clicked");
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
	/*console.log("Socket状态:" + readyStatus[socket.readyState]);*/
	//location.href = "http://www.baidu.com";
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