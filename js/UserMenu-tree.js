var TreeData;
var $dataid;
var UITree = function() {

	var handleSample2 = function() {
		var treeObj = {};

		$('#tree_2').jstree({

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

	}

	$("#usermenu_save").on("click", function() {

		var Array = [];
		//$("#tree_2").find("a").addClass("jstree-clicked");
		/*	if($dataid!=undefined)
			{
				console.log($("#tree_2").find("a .jstree-clicked"));
			}*/
		if($dataid != undefined) {
			$.each($("#tree_2").find(".jstree-clicked").parent(), function(index, item) {
				Array.unshift(item.id);

			});
			
			var module = Array.join(',');
			var jsStr = "SetModuleForUser {\"id\":\"" + $dataid + "\",\"module\":\"" + module + "\"}";

			send(jsStr);
		}

	});

	//连接成功
	socket.onopen = function() {

		if($.cookie("user") && $.cookie("password")) {
			socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
		}

		send("userlist");
		send("ModuleListByTree");
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
		/*数组去重*/
		Array.prototype.unique = function() {
			this.sort(); //先排序
			var res = [this[0]];
			for(var i = 1; i < this.length; i++) {
				if(this[i] !== res[res.length - 1]) {
					res.push(this[i]);
				}
			}
			return res;
		}
		/*var arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0]
		alert(arr.unique2());*/
		/*var active = function(ary) {
			console.log(ary);
			var arylist=[];
			for(var i = 0; i < ary.length; i++) {
				$("#" + ary[i]).find("a:first").addClass("jstree-clicked");*/
				/*查出每个li 父节点集合*/
				
			  /*  arylist.push($("#" + ary[i]).parent().parent().attr('id'));	
             */
				/* this.element.find('.jstree-undetermined').removeClass('jstree-undetermined');
			  alert("22");
			 for(i = 0, j = p.length; i < j; i++) {
				if(!m[p[i]].state[ t ? 'selected' : 'checked' ]) {
					s = this.get_node(p[i], true);
					if(s && s.length) {
						s.children('.jstree-anchor').children('.jstree-checkbox').addClass('jstree-undetermined');
					}
				}
			}*/
			//}
			/*获取所有选中元素的父节点*/
            /* arylist=arylist.unique();
             console.log(arylist);
             for(var i=0;i<arylist.length;i++)
             {
             	
             }*/
             
			/*	var count = 0;
				var $alist_length = $("#" + $id).siblings().length+1;//获取选中节点父节点的子节点的个数	
				if($("#" + $id).parent().html();
				for(var i = 0; i < $alist_length; i++) {
		
					if($("#" + $id).parent().parent().find("li a").eq(i).hasClass("jstree-clicked")) {
						count++;
					}
				}
				if(count == $alist_length) {
					$("#" + $id).parent().parent().find("a").addClass("jstree-clicked");
				} else {

					$("#" + $id).parent().parent().find("a:first").removeClass("jstree-clicked").children(":first").addClass("jstree-undetermined");

				}*/

		//}


	         /*点击用户列表 给菜单添加样式*/
			var active = function($id) {

			$("#" + $id).find("a:first").addClass("jstree-clicked");
			var count = 0;
			console.log($id);
			var $alist_length = $("#" + $id).siblings().length+1;//获取选中节点父节点的子节点的个数
			/*判定每个节点是否还有父节点*/

			for(var i = 0; i < $alist_length; i++) {
			
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
					case "UserList":
						/*获取集合*/
						$(".userMenu_left tbody").html(bindUserTable(result["data"]));
						/* 点击事件*/
						$(".userMenu_left  tbody tr").click(function() {
							$dataid = $(this).attr("data_uid");

							$("#tree_2").find('.jstree-undetermined').removeClass('jstree-undetermined');
							$("#tree_2").find("a").removeClass("jstree-clicked");

							var jsStr = "ModuleListByUser {\"id\":\"" + $dataid + "\"}";
							send(jsStr);
						});

						break;

					case "ModuleListByTree":
						/*获取树集合*/
						TreeData = result["data"];
						UITree.init();
						$('#tree_2').jstree().open_all();
						break;
					case "ModuleListByUser":
					  
						var ary = result["info"].split(',');
							for(var i = 0; i < ary.length; i++) {
						    active(ary[i]);
						}

						break;
					case "SetModuleForUser":
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