
/*定义变量，模拟量：DoubleFloat，开关量：Boolean*/
var dataType = "DoubleFloat";

/*table数据*/
var AlarmTagData;

/*复选框操作*/
var indexsDel;

/*userid*/
var pUsername = $.cookie("user");

/*点名*/
var pTagName = "";

/*描述*/
var pDescription = "";

/*导出时返回的文件地址*/
var fileName1;

// 页面加载
$(function() {

	$("[name='my-checkbox']").bootstrapSwitch();

	$("#switchlight").bootstrapSwitch({
		size: "large",
		state: true
	});

	$("#switchlight").on('switchChange.bootstrapSwitch', function(e, state) {
		if(state) {
			/*模拟量*/
			dataType = "DoubleFloat";

			$("#tblSwitch").hide();
			$("#tblAnalog").show();
			$("#checkAll").prop('checked', false);
			$("#checkAll1").prop('checked', false);
			$("input[name='check_table']").prop('checked', false);
			$("input[name='check_table1']").prop('checked', false);

			Senddata();
		} else {

			/*开关量*/
			dataType = "Boolean";

			$("#tblAnalog").hide();
			$("#tblSwitch").show();
			$("#checkAll").prop('checked', false);
			$("#checkAll1").prop('checked', false);
			$("input[name='check_table']").prop('checked', false);
			$("input[name='check_table1']").prop('checked', false);
            $("#tblSwitch tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
			Senddata();
			//send("AlarmTagInfo {\"username\":\"" + $.cookie("user") + "\",\"DataType\":\"" + dataType + "\",\"tagName\":\"" + pTagName + "\",\"Description\":\"" + "" + "\"}");

		}
	});

	/*全选 反选 模拟量*/
	$("#checkAll").click(
		function() {

			if(this.checked) {

				$("input[name='check_table']").prop('checked', true);

			} else {
				$("input[name='check_table']").prop('checked', false);
			}
		}
	);

	/*全选 反选 开关量*/
	$("#checkAll1").click(
		function() {

			if(this.checked) {

				$("input[name='check_table1']").prop('checked', true);

			} else {
				$("input[name='check_table1']").prop('checked', false);
			}
		}
	);

	/*单选全选后,全选按钮选中*/
	$("tbody").bind("click", function() {

		/*模拟量*/
		if(dataType == "DoubleFloat") {
			var $check = $("input[name='check_table']:checked");
			var ototal = $check.length;

			if($("input[name='check_table']").length == ototal) {
				$("#checkAll").prop("checked", true);
			} else {
				$("#checkAll").prop("checked", false);
			}
		} else //开关量
		{
			var $check = $("input[name='check_table1']:checked");
			var ototal = $check.length;

			if($("input[name='check_table1']").length == ototal) {
				$("#checkAll1").prop("checked", true);
			} else {
				$("#checkAll1").prop("checked", false);
			}
		}

	});

	/*添加*/
	$("#Base_Add").click(function() {

		$("#Base_Add").prop("data-toggle", "modal");

		if(dataType == "DoubleFloat") {
			$('#myModal_Add').modal('show')
		} else {
			$('#myModal_Add1').modal('show')
		}
		
	});
	/*添加模拟量*/
	$("#save_Add").on("click", function() {
		if($("#dot_Add_D").val().trim() == "") {
			shalert("点名不能为空");
			return false;
		}
		if($("#type_Add_D").val().trim() == "") {
			shalert("类型不能为空！");
			return false;
		}
		if($("#inputdes_Add_D").val().trim() == "") {
			shalert("描述不能为空！");
			return false;
		}
		
		var jsStr = "AddAlarmTagInfo {\"tagname\":\"" + $("#dot_Add_D").val().trim() + "\",\"collectorId\":\"" + $("#Collector_D").val().trim() + "\",\"description\":\"" + $("#inputdes_Add_D").val().trim() + "\",\"DataType\":\"" + $("#type_Add_D").val().trim() + "\",\"HHAlarm\":\"" + $("#inputHighAlarm_Add_D").val().trim() + "\",\"HAlarm\":\"" + $("#inputHighAlarm_Add_D_2").val().trim() + "\",\"LAlarm\":\"" + $("#inputLowAlarm_Add_D_2").val().trim() + "\",\"LLAlarm\":\"" + $("#inputLowAlarm_Add_D").val().trim() + "\",\"ItemAlarmBoolValue\":\"" + "1" + "\",\"IsAlarm\":\"" + $("#inputcall_Add_D").val().trim() + "\"}";
		 
		send(jsStr);
	});
	/*添加开关量*/
	$("#save_Add_1").on("click", function() {
		var jsStr = "AddAlarmTagInfo {\"tagname\":\"" + $("#dot_Add_B").val().trim() + "\",\"collectorId\":\"" + $("#Collector_B").val().trim() + "\",\"description\":\"" + $("#inputdes_Add_B").val().trim() + "\",\"DataType\":\"" + $("#type_Add_B").val().trim() + "\",\"HHAlarm\":\"" + "" + "\",\"HAlarm\":\"" + "" + "\",\"LAlarm\":\"" + "" + "\",\"LLAlarm\":\"" + "" + "\",\"ItemAlarmBoolValue\":\"" + $("#ItemAlarmBoolValue_B").val().trim() + "\",\"IsAlarm\":\"" + $("#inputcall_Add_B").val().trim() + "\"}";
		send(jsStr);
	});
	/*修改*/
	$("#alarm_update").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");

			//模拟量
			if(dataType == "DoubleFloat") {
				$('#myModal_Update').modal('show');

				idIndexUpdate = $("input[name='check_table']:checked").val();

				var obj = AlarmTagData[idIndexUpdate];

				/*是否报警,如果为空,默认为是*/
				var pIsAlarm = obj["IsAlarm"] == null ? "1" : obj["IsAlarm"];
                console.log(pIsAlarm);
				$("#txtTagNameU").val(obj["Tagname"]);
				$("#txtDataTypeU").val(obj["DataType"]);
				$("#txtDescriptionU").val(obj["Description"]);
				$("#select_IsAlarmU").val(pIsAlarm);
				
				$("#txtHHAlarm").val(obj["HHAlarm"]);
				$("#txtHAlarm").val(obj["HAlarm"]);
				$("#txtLAlarm").val(obj["LAlarm"]);
				$("#txtLLAlarm").val(obj["LLAlarm"]);
				UpdateAlarmData(obj["ID"]);

			} else // 开关量
			{
				$('#myModal_Update1').modal('show');

				idIndexUpdate = $("input[name='check_table1']:checked").val();

				var obj = AlarmTagData[idIndexUpdate];

				/*是否报警,如果为空,默认为是*/
				var pIsAlarm = obj["IsAlarm"] == null ? "1" : obj["IsAlarm"];

				$("#txtTagNameU1").val(obj["Tagname"]);
				$("#txtDataTypeU1").val(obj["DataType"]);
				$("#txtDescriptionU1").val(obj["Description"]);
				$("#select_IsAlarmU1").val(pIsAlarm);
				$("#select_Switch").val(obj["ItemAlarmBoolValue"]);
				UpdateAlarmData(obj["ID"]);
			}
		}
	});

	/*查询按钮点击事件（模糊查询）*/
	$("#btnQuery").click(function() {

		/*点名*/
		pTagName = $("#txtDataType").val().trim();

		/*描述*/
		pDescription = $("#txtTagName").val().trim();

		Senddata();

	});
	/*导出*/
	$("#btnExcel").click(function() {

		/*点名*/

		var txt_name = $("#txtDataType").val().trim();

		/*描述*/
		var txt_describe = $("#txtTagName").val().trim();
	
		var jsStr = "OutputAlarmInfo {\"username\":\"" + $.cookie("user") + "\",\"DataType\":\"" + dataType + "\",\"tagName\":\"" + txt_name + "\",\"Description\":\"" + txt_describe + "\"}";
		
		send(jsStr);
	});

	/*删除user_delete*/
	$("#alarm_delete").click(function() {
		//当复选框已经被选中后
		indexsDel = CheckedLength("del");

		if(indexsDel) {
			shconfirm("确定要删除吗", function(result) {
				var id = "";
				if(result) {
					var jsStr = "DeleteAlarmTagInfo {\"id\":\"";
					for(var i = 0; i < indexsDel.length; i++) {

						jsStr += AlarmTagData[indexsDel[i]]["ID"] + "\,";
					}
					jsStr = jsStr.substring(0, jsStr.length - 1) + "\"";
					jsStr += "}";

				}
				send(jsStr);
			});
		}
	});


	/*导出模板按钮点击事件*/
	$("#btnExportTemplate").click(function() {
		fileName1 = "BaseTags.xls";
		send("DownLoadFile {\"filename\":\"" + "ReportModel/BaseTags.xls" + "\"}");

	});


	/*导出按钮点击事件*/
	$("#btnOutputExcel").click(function() {
		send("OutputAlarmInfo {\"username\":\"" + $.cookie("user") + "\",\"DataType\":\"" + dataType + "\",\"tagName\":\"" + pTagName + "\",\"Description\":\"" + pDescription + "\"}");
	});
});

/*对全选项的判定*/
function CheckedLength() {

	var oChecked;
	if(dataType == "DoubleFloat") {
		oChecked = document.getElementsByName("check_table");
	} else {
		oChecked = document.getElementsByName("check_table1");
	}

	var total = 0;
	var checked = [];
	for(var i = 0; i < oChecked.length; i++) {
		if(oChecked[i].checked) {
			total++;
			checked.push(oChecked[i].value);
		}
	}

	if(arguments.length > 0) {
		if(total == 0) {
			shalert('请选择操作项！');
			return false;
		} else {
			return checked;
		}
	} else {
		if(total == 0) {
			shalert('请选择操作项！');
			return false;
		} else if(total != 1) {
			shalert('请选择一项进行操作！');
			return false;
		} else {
			return true;
		}
	}
}

/*修改*/
function UpdateAlarmData(Alarmid) {

	/*取消click绑定事件*/
	$("#save_UpdateDouble").unbind("click");
	$("#save_UpdateDouble").click(function() {

		var jsStr1 = "UpdateAlarmTagInfo {\"id\":\"" + Alarmid + "\",\"DataType\":\"" + $("#txtDataTypeU").val().trim() + "\",\"HHAlarm\":\"" + $("#txtHHAlarm").val().trim() + "\",\"HAlarm\":\"" + $("#txtHAlarm").val().trim() + "\",\"LAlarm\":\"" + $("#txtLAlarm").val().trim() + "\",\"LLAlarm\":\"" + $("#txtLLAlarm").val().trim() + "\",\"ItemAlarmBoolValue\":\"" + "1" + "\",\"IsAlarm\":\"" + $("#select_IsAlarmU").val().trim() + "\"}";

		send(jsStr1);
	});

	/*取消click绑定事件*/
	$("#save_UpdateBoolean").unbind("click");
	$("#save_UpdateBoolean").click(function() {

		var jsStr2 = "UpdateAlarmTagInfo {\"id\":\"" + Alarmid + "\",\"DataType\":\"" + $("#txtDataTypeU1").val().trim() + "\",\"HHAlarm\":\"" + "" + "\",\"HAlarm\":\"" + "" + "\",\"LAlarm\":\"" + "" + "\",\"LLAlarm\":\"" + "" + "\",\"ItemAlarmBoolValue\":\"" + $("#select_Switch").val().trim() + "\",\"IsAlarm\":\"" + $("#select_IsAlarmU1").val().trim() + "\"}";

		send(jsStr2);
	});
}

// 发送消息
function Senddata() {
	
	$("#tblAnalog tbody").html('<tr><td colspan="9"><span>正在加载中...</span></td></tr>');
	
	send("AlarmTagInfo {\"username\":\"" + $.cookie("user") + "\",\"DataType\":\"" + dataType + "\",\"tagName\":\"" + pTagName + "\",\"Description\":\"" + pDescription + "\"}");
}


/*获取模拟量集合*/
function bindAnalogTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			// 描述
			var pDescription = data["Description"] == null ? "" : data["Description"];

			// 是否报警
			var pIsAlarmName;

			if(data["IsAlarm"] == "0") {
				pIsAlarmName = "否";
			} else if(data["IsAlarm"] == "1") {
				pIsAlarmName = "是";
			} else {
				pIsAlarmName = "";
			}

			// 高高限值
			var pHHAlarm = data["HHAlarm"] == null ? "" : data["HHAlarm"];

			// 高限值
			var pHAlarm = data["HAlarm"] == null ? "" : data["HAlarm"];

			// 低限值
			var pLAlarm = data["LAlarm"] == null ? "" : data["LAlarm"];

			// 低低限值
			var pLLAlarm = data["LLAlarm"] == null ? "" : data["LLAlarm"];

			str += "<tr role='row'>";
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + index + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td>" + data["Tagname"] + "</td>";
			str += "<td>" + data["DataType"] + "</td>";
			str += "<td>" + pDescription + "</td>";
			str += "<td>" + pIsAlarmName + "</td>";
			str += "<td>" + pHHAlarm + "</td>";
			str += "<td>" + pHAlarm + "</td>";
			str += "<td>" + pLAlarm + "</td>";
			str += "<td>" + pLLAlarm + "</td>";
			str += "</tr>";
		});
	}

	return str;
}

/*模拟量strCollector,重新赋值一行*/
function AddtrAnalog(datatable) {

	// 描述
	var pDescription = datatable["Description"] == null ? "" : datatable["Description"];

	// 是否报警
	var pIsAlarm = datatable["IsAlarm"] == null ? "" : (datatable["IsAlarm"]=="0"?"否":"是");

	// 高高限值
	var pHHAlarm = datatable["HHAlarm"] == null ? "" : datatable["HHAlarm"];

	// 高限值
	var pHAlarm = datatable["HAlarm"] == null ? "" : datatable["HAlarm"];

	// 低限值
	var pLAlarm = datatable["LAlarm"] == null ? "" : datatable["LAlarm"];

	// 低低限值
	var pLLAlarm = datatable["LLAlarm"] == null ? "" : datatable["LLAlarm"];

	var str = "";
	//var length = parseInt(AlarmTagData.length) - 1;
	str += "<tr role='row'>"
	str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
	str += "<input type='checkbox' class='checkboxes' value='" + datatable["value"] + "' name='check_table'>";
	str += "<span></span>";
	str += "</label> </td>";
	str += "<td>" + datatable["Tagname"] + "</td>";
	str += "<td>" + datatable["DataType"] + "</td>";
	str += "<td>" + pDescription + "</td>";
	str += "<td>" + pIsAlarm + "</td>";
	str += "<td>" + pHHAlarm + "</td>";
	str += "<td>" + pHAlarm + "</td>";
	str += "<td>" + pLAlarm + "</td>";
	str += "<td>" + pLLAlarm + "</td>";
	str += "</tr>";
	return str;
}

/*获取开关量集合*/
function bindSwitchTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			// 描述
			var pDescription = data["Description"] == null ? "" : data["Description"];

			// 是否报警
			var pIsAlarm;

			if(data["IsAlarm"] == "0") {
				pIsAlarm = "否";
			} else if(data["IsAlarm"] == "1") {
				pIsAlarm = "是";
			} else {
				pIsAlarm = "";
			}

			// 开关量
			var pItemAlarmBoolValue = data["ItemAlarmBoolValue"] == null ? "" : data["ItemAlarmBoolValue"];

			str += "<tr role='row'>";
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + index + "' name='check_table1'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td>" + data["Tagname"] + "</td>";
			str += "<td>" + data["DataType"] + "</td>";
			str += "<td>" + pDescription + "</td>";
			str += "<td>" + pIsAlarm + "</td>";
			str += "<td>" + pItemAlarmBoolValue + "</td>";
			str += "</tr>";
		});
	}

	return str;
}

/*开关量,重新赋值一行*/
function AddtrSwitch(datatable) {
	// 描述
	var pDescription = datatable["Description"] == null ? "" : datatable["Description"];

	// 是否报警
	var pIsAlarm = datatable["IsAlarm"] == null ? "" : (datatable["IsAlarm"]=="0"?"否":"是");

	// 开关量
	var pItemAlarmBoolValue = datatable["ItemAlarmBoolValue"] == null ? "" : datatable["ItemAlarmBoolValue"];

	var str = "";
	//var length = parseInt(AlarmTagData.length) - 1;
	str += "<tr role='row'>"
	str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
	str += "<input type='checkbox' class='checkboxes' value='" + datatable["value"] + "' name='check_table1'>";
	str += "<span></span>";
	str += "</label> </td>";
	str += "<td>" + datatable["Tagname"] + "</td>";
	str += "<td>" + datatable["DataType"] + "</td>";
	str += "<td>" + pDescription + "</td>";
	str += "<td>" + pIsAlarm + "</td>";
	str += "<td>" + pItemAlarmBoolValue + "</td>";
	str += "</tr>";
	return str;
}
/*采集器绑定*/
function CollectorBind(data) {
	var strCollector = "";
	if(data.length > 0) {
		$.each(data, function(index, item) {
			strCollector += "<option value=" + item["ID"] + ">" + item["CollectorName"] + "</option>";
		});

	}

	return strCollector;

}
/*采集器数据绑定*/
function Collectorsend()
{
	
	var jsStr = "CollectorListByUsername {\"username\":\"" + $.cookie("user") + "\"}";
	
	send(jsStr);
	
	
}
//连接成功
socket.onopen = function() {
	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}
	//数据绑定
	Senddata();
	/*采集器数据*/
	Collectorsend();
}

//收到消息
socket.onmessage = function(msg) {
	var result = msg.data;
	
	if(typeof result == "string") {
		result = JSON.parse(result);

		if(result["error"]) {
			shalert(result["error"]);
		} else if(result["exception"]) {
			shalert(result["exception"]);
		} else {
			switch(result["Function"]) {
				case "AlarmTagInfo":
					AlarmTagData = result["data"];
					

					if(dataType == "DoubleFloat") {
						if(result["data"].length == 0) {
							shalert("查无资料");
							$("#tblAnalog tbody").html("");
						} else {
							$("#tblAnalog tbody").html(bindAnalogTable(result["data"]));
						}
					} else {
						if(result["data"].length == 0) {
							shalert("查无资料");
							$("#tblSwitch tbody").html("");
						} else {
							$("#tblSwitch tbody").html(bindSwitchTable(result["data"]));
						}
					}
					break;

				case "UpdateAlarmTagInfo":
					shalert("更新成功");

					var ckbs;
					//模拟量
					if(dataType == "DoubleFloat") {
						ckbs = $("input[name='check_table']:checked");

						var obj = {
							"Id": AlarmTagData[idIndexUpdate].ID,
							"Tagname": $("#txtTagNameU").val().trim(),
							"DataType": $("#txtDataTypeU").val().trim(),
							"Description": $("#txtDescriptionU").val().trim(),
							"IsAlarm": $("#select_IsAlarmU").val().trim(),
							"HHAlarm": $("#txtHHAlarm").val().trim(),
							"HAlarm": $("#txtHAlarm").val().trim(),
							"LAlarm": $("#txtLAlarm").val().trim(),
							"LLAlarm": $("#txtLLAlarm").val().trim()
						};

						AlarmTagData[idIndexUpdate].Tagname = $("#txtTagNameU").val().trim();
						AlarmTagData[idIndexUpdate].DataType = $("#txtDataTypeU").val().trim();
						AlarmTagData[idIndexUpdate].Description = $("#txtDescriptionU").val().trim();
						AlarmTagData[idIndexUpdate].IsAlarm = $("#select_IsAlarmU").val().trim();
						AlarmTagData[idIndexUpdate].HHAlarm = $("#txtHHAlarm").val().trim();
						AlarmTagData[idIndexUpdate].HAlarm = $("#txtHAlarm").val().trim();
						AlarmTagData[idIndexUpdate].LAlarm = $("#txtLAlarm").val().trim();
						AlarmTagData[idIndexUpdate].LLAlarm = $("#txtLLAlarm").val().trim();
						ckbs.each(function() {
                           obj.value=$(this).val();
							$(this).parent().parent().parent().replaceWith(AddtrAnalog(obj));

						});
						$('#myModal_Update').modal('hide');
					} else // 开关量
					{
						ckbs = $("input[name='check_table1']:checked");

						var obj = {
							"Id": AlarmTagData[idIndexUpdate].ID,
							"Tagname": $("#txtTagNameU1").val().trim(),
							"DataType": $("#txtDataTypeU1").val().trim(),
							"Description": $("#txtDescriptionU1").val().trim(),
							"IsAlarm": $("#select_IsAlarmU1").val().trim(),
							"ItemAlarmBoolValue": $("#select_Switch option:selected").text().trim()
						};

						AlarmTagData[idIndexUpdate].Tagname = $("#txtTagNameU1").val().trim();
						AlarmTagData[idIndexUpdate].DataType = $("#txtDataTypeU1").val().trim();
						AlarmTagData[idIndexUpdate].Description = $("#txtDescriptionU1").val().trim();
						AlarmTagData[idIndexUpdate].IsAlarm = $("#select_IsAlarmU1").val().trim();
						AlarmTagData[idIndexUpdate].ItemAlarmBoolValue = $("#select_Switch option:selected").text().trim();
						ckbs.each(function() {
                        obj.value=$(this).val();
							$(this).parent().parent().parent().replaceWith(AddtrSwitch(obj));

						});
						$('#myModal_Update1').modal('hide');
					}

					break;

				case "DeleteAlarmTagInfo":

					var ckbs;

					//模拟量
					if(dataType == "DoubleFloat") {
						ckbs = $("input[name='check_table']:checked");
					} else {
						ckbs = $("input[name='check_table1']:checked");
					}

					ckbs.each(function() {
						$(this).parent().parent().parent().remove();

					});

					shalert("删除成功");
					break;
				case "OutputAlarmInfo":

					var jsStr = "DownLoadFile {\"filename\":\"" + result["info"].replace("\\", "/") + "\"}";
					fileName1 = result["info"].replace("\\", "/").split('/')[1];;			
					send(jsStr);
					break;
				case "AddAlarmTagInfo":
					
					shalert("添加成功！");
					 var valuel=parseInt(AlarmTagData.length);
					//模拟量
					if(dataType == "DoubleFloat") {
						/*修改保存的集合*/
						var obj = {
							"ID": result["info"],
							"value":valuel,
							"Tagname": $("#dot_Add_D").val().trim(),
							"Description": $("#inputdes_Add_D").val().trim(),
							"IsAlarm": $("#inputcall_Add_D").val().trim(),
							"HHAlarm": $("#inputHighAlarm_Add_D").val().trim(),
							"HAlarm": $("#inputHighAlarm_Add_D_2").val().trim(),
							"LAlarm": $("#inputLowAlarm_Add_D_2").val().trim(),
							"LLAlarm": $("#inputLowAlarm_Add_D").val().trim(),
							"ItemAlarmBoolValue":"1",
							"DataType": $("#type_Add_D").val().trim()
						};
                        
						AlarmTagData.push(obj);
						console.log(obj);
						/*动态的添加到页面*/
						$("#tblAnalog tbody").prepend(AddtrAnalog(obj));
                 
					} else {
						/*修改保存的集合*/
						var obj = { 
							"ID": result["info"],
							"value":valuel,
							"Tagname": $("#dot_Add_B").val().trim(),
							"Description": $("#inputdes_Add_B").val().trim(),
							"IsAlarm": $("#inputcall_Add_B").val().trim(),
							"HHAlarm": "",
							"HAlarm": "",
							"LAlarm": "",
							"LLAlarm": "",
							"ItemAlarmBoolValue":$("#ItemAlarmBoolValue_B").val().trim(),
							"DataType": $("#type_Add_B").val().trim()
						};

						AlarmTagData.push(obj);
						/*动态的添加到页面*/
						$("#tblSwitch tbody").prepend(AddtrSwitch(obj));
					}
					break;
					case "CollectorListByUsername":
					
					if(result["data"].length==0)
					{
						$("#Base_Add").hide();
					}else
					{
						
						$("#Collector_D").html(CollectorBind(result["data"]));
						$("#Collector_B").html(CollectorBind(result["data"]));
						
					}
					break;
			}
		}

	} else {
		var blob = new Blob([msg.data], {
				type: "applicationnd.ms-excel"
			}),
			fileName = fileName1; //'BaseTags.xls';
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
		window.URL.revokeObjectURL(link.href);
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
