var TreeData;
var UITree = function() {

	var handleSample2 = function() {
		var treeObj = {};

		$('#tree_2').jstree({

			'plugins': ["checkbox", "types"],
			'core': {
				"themes": {
					"responsive": false
				},
				'data': [{
						"text": "Same but with checkboxes",
						"children": [{
							"text": "initially selected1",
							"state": {
								"selected": true
							}
						}, {
							"text": "custom icon",
							"icon": "fa fa-folder icon-state-warning"
						}, {
							"text": "initially open1",
							"icon": "fa fa-folder icon-state-warning",
							"state": {
								"opened": true
							},
							"children": ["Another node"]
						}, {
							"text": "custom icon",
							"icon": "fa fa-folder icon-state-warning"
						}, {
							"text": "disabled node",
							"icon": "fa fa-folder icon-state-warning",
							/* "state": {
							     "opened": true
							 }*/
						}]
					},
					"And wholerow selection"
				]//TreeData
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
		$("#tree_2").bind("activate_node.jstree", function(obj, e) {
			var currentNode = e.node;
			treeObj = currentNode;

		});
		$('#tree_2').on("click.jstree", function(e) {
			console.log(treeObj);
			console.log(treeObj.id);
		});
	}


	/*用户数据绑定*/
	function bindUserTable(datatable) {
		if(datatable.length > 0) {
			var str = "";
			$.each(datatable, function(index, data) {

				str += "<tr class='gradeX even' role='row' data_uid='" + data["Id"] + "'>"
				str += "<td >" + data["UserName"] + "</td>";
				str += "<td>" + data["RealName"] + "</td>";
				str += "</tr>";

			});

		}

		return str;
	}
	//连接成功
	socket.onopen = function() {

		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}

		send("userlist");
	}

	return {
		//main function to initiate the module
		init: function() {

			handleSample2();

		}

	};

}();
var ChirdID;
if(App.isAngularJsApp() === false) {
	jQuery(document).ready(function() {

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
					case "UserList":
					 $(".userMenu_left").html(bindUserTable(result["data"]));
				       $(".userMenu_left  tbody tr").click(function(){
				       	var $dataid = $(this).attr("data_uid");
     	                 var jsStr = "ModuleListByUser {\"id\":\"" + $dataid+ "\"}";
							send(jsStr);
				       });
						
						break;

					case "ModuleListByTree":
						TreeData = result["data"];
						UITree.init();
						break;
						case "ModuleListByUser":
						console.log(result["data"]);
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
}: