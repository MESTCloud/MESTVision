var TreeData;
var ChirdID;
var New_node;
var Inst;
var Obje;
var currentNode;
var Tree_Url;
var UITree = function() {

	var contextualMenuSample = function() {
		var currentNode = "";

		$("#tree_3").jstree({

			"core": {
				"themes": {
					"responsive": false
				},
				// so that create works
				"check_callback": true,
				'data': TreeData
			},
			"types": {
				"default": {
					"icon": "fa fa-folder icon-state-warning icon-lg"
				},
				"file": {
					"icon": "fa fa-file icon-state-warning icon-lg"
				}
			},
			"state": {
				"key": "demo2"
			},
			"contextmenu": {
				"items": {

					"create": {
						"label": "添加",
						"action": function(obj) {
							var inst = jQuery.jstree.reference(obj.reference);
							var obj = inst.get_node(obj.reference);
							$(this).prop("data-toggle", "modal");
							$('#my_Modal_tree_Add').modal('show');
							$("#save_inputTreeAdd").unbind("click");
							$("#save_inputTreeAdd").on("click", function() {

								if($("#input_treeName").val().trim() == "") {
									shalert("节点名称不能为空！");
									return false;
								}
								if($("#inputTree_Add").val().trim() == "") {
									shalert("请选择图标");
									return false;
								}
								//New_node = new_node;
								Inst = inst;
								Obje = obj;
								var jsStr = "AddModule {\"parent\":\"" + obj.id + "\",\"name\":\"" + $("#input_treeName").val().trim() + "\",\"image\":\"" + $("#inputTree_Add").val().trim() + "\",\"url\":\"" + $("#input_treeAddress").val().trim() + "\"}";
								send(jsStr);

								//alert(ChirdID);
								
							});

						}
					},

					"rename": {
						"separator_before": false,
						"separator_after": false,
						"_disabled": false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
						"label": "修改",
						/*!
						"shortcut"			: 113,
						"shortcut_label"	: 'F2',
						"icon"				: "glyphicon glyphicon-leaf",
						*/
						"action": function(data) {
							var inst = $.jstree.reference(data.reference),
								obj = inst.get_node(data.reference);
                            
							$(this).prop("data-toggle", "modal");
							$('#my_Modal_tree_Update').modal('show');
							$("#input_treeName_update").val(obj.text);
							//console.log((obj.icon.split(' '))[2]);
							//$("#inputTree_Update").val((obj.icon.split(' '))[2]);
                            $("#inputTree_Update").val("icon-bar-chart");
							$("#input_treeAddress_update").val(obj.url);
							$("#save_inputTreeUpdate").unbind("click");
							$("#save_inputTreeUpdate").on("click", function() {
								if($("#input_treeName_update").val().trim() == "") {
									shalert("节点名称不能为空！");
									return false;
								}
								if($("#inputTree_Update").val().trim() == "") {
									shalert("请选择图标");
									return false;
								}

								var jsStr = "UpdateModule {\"id\":\"" + obj.id + "\",\"parent\":\"" + obj.parent + "\",\"name\":\"" + $("#input_treeName_update").val().trim() + "\",\"image\":\"" + $("#inputTree_Update").val().trim() + "\",\"url\":\"" + $("#input_treeAddress_update").val().trim() + "\"}";

								send(jsStr);
								Obje = obj;
								Inst = inst;
								

							});

						}
					},

					"delete": {
						"label": "删除",
						"action": function(data) {
							var inst = $.jstree.reference(data.reference),
								obj = inst.get_node(data.reference);
							shconfirm("确定要删除吗", function(result) {
								if(result) {
									var jsStr = "DeleteModule {\"id\":\"" + obj.id + "\"}";
									send(jsStr);
									
									Inst = inst;
									Obje = obj;
                       
								}
							})

							
						}
					}
				}
			},

			"plugins": ["contextmenu", "state", "types"]
		});

		$('#tree_3').bind("activate_node.jstree", function(obj, e) {

			currentNode = e.node;
		});
		$("#tree_3").bind("click.jstree", function(obj, e) {

			var jsStr = "ModuleListByParent {\"id\":\"" + currentNode.id + "\"}";
			send(jsStr);

		});

	}

	//连接成功
	socket.onopen = function() {

		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}

		socket.send("ModuleListByTree");

	}

	return {
		//main function to initiate the module
		init: function() {

			contextualMenuSample();

		}

	};

}();

if(App.isAngularJsApp() === false) {
	jQuery(document).ready(function() {
		function bindTable(datatable) {
			if(datatable.length > 0) {
				var str = "";
				$.each(datatable, function(index, data) {

					str += "<tr class='gradeX odd' role='row'>"

					str += "<td>" + data["FullName"] + "</td>";
					str += "<td>" + data["NavigateUrl"] + "</td>";

					str += "</tr>";

				});

			}

			return str;
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
					case "ModuleListByTree":
						TreeData = result["data"];
						
						UITree.init();
						break;
					case "AddModule":

						ChirdID = result["info"];
						shalert("添加成功");
						/*节点内容*/
						var new_node = {};
						new_node.id = ChirdID;
						new_node.text = $("#input_treeName").val().trim();
						new_node.icon = "fa fa-folder icon-state-warning icon-lg";
						new_node.url = $("#input_treeAddress").val().trim();
                        /*创建节点*/
						Inst.create_node(Obje, new_node, "last", function(new_node) {

							Inst.edit(new_node);
						});

						$('#my_Modal_tree_Add').modal('hide');
						/*初始化*/
						$("#input_treeName").val("");
						$("#input_treeAddress").val("");
						$("#inputTree_Add").val("icon-user-female");
						New_node = "";
						Inst = "";
						break;
					case "UpdateModule":
						shalert("修改成功");
						Obje.text = $("#input_treeName_update").val().trim();
						Obje.icon = "fa fa-folder icon-state-warning icon-lg";
						/*对页面树节点的修改*/
						Inst.edit(Obje);
						$('#my_Modal_tree_Update').modal('hide');
						$("#input_treeName_update").val("");
						$("#inputTree_Update").val("icon-user-female");
						$("#input_treeAddress_update").val("input_treeAddress_update");
						Inst = "";
						Obje = "";
						break;
					case "DeleteModule":

						shalert("删除成功");
						if(Inst.is_selected(Obje)) {
							Inst.delete_node(Inst.get_selected());
						} else {
							Inst.delete_node(Obje);
						}
						Inst="";
						Obje="";
						break;

					case "ModuleListByParent":
						if(result["data"].length > 0) {
							$(".right_row tbody").html(bindTable(result["data"]));
						} else {
							$(".right_row tbody").html("");
						}
						break;

				}

			}
		}

	});
}

//连接断开
socket.onclose = function(event) {
	//console.log("Socket状态:" + readyStatus[socket.readyState]);
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