$(function() {
	
	/*全选 反选*/
	$("#checkAll").click(
		function() {
			if(this.checked) {

				$("input[name='check_table']").prop('checked', true);

			} else {
				$("input[name='check_table']").prop('checked', false);

			}
		}
	);
	
	/*单选全选后,全选按钮选中*/
	$("tbody").bind("click", function() {
		var $check = $("input[name='check_table']:checked");
		var ototal = $check.length;

		if($("input[name='check_table']").length == ototal) {
			$("#checkAll").prop("checked", true);
		} else {
			$("#checkAll").prop("checked", false);
		}
	});
		
	/*修改*/
	$("#user_update").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");
			$('#myModal_Update').modal('show')
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
		var oChecked = document.getElementsByName("check_table");
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