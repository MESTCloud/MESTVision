$(function() {

	/*定义变量，模拟量：DoubleFloat，开关量：Boolean*/
	var dataType = "DoubleFloat";

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

		} else {
			
			/*开关量*/
			dataType = "Boolean";

			$("#tblAnalog").hide();
			$("#tblSwitch").show();
			$("#checkAll").prop('checked', false);
			$("#checkAll1").prop('checked', false);
			$("input[name='check_table']").prop('checked', false);
			$("input[name='check_table1']").prop('checked', false);
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
	$("#user_Add").click(function() {

		$("#user_Add").prop("data-toggle", "modal");

		if(dataType == "DoubleFloat") {
			$('#myModal_Add').modal('show')
		} else {
			$('#myModal_Add1').modal('show')
		}
	});

	/*修改*/
	$("#user_update").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");

			//模拟量
			if(dataType == "DoubleFloat") {
				$('#myModal_Update').modal('show')
			} else // 开关量
			{
				$('#myModal_Update1').modal('show')
			}

		}

	});

	/*删除user_delete*/
	$("#user_delete").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			shconfirm("确定要删除吗", function(result) {
				if(result) {
					/* 对删除进行交互;*/
					shalert("删除成功");
				}
			});
		}
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
		for(var i = 0; i < oChecked.length; i++) {
			if(oChecked[i].checked) {
				total++;
			}
		}

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

});