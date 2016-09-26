/*交互*/
$(function() {
	$.ajax({
		url: "../js/json",
		type: "get",
		dataType: "json",
		success: function(data) {
			$("tbody").html(bindTable(data));
		}
	});
});
/*获取集合*/
function bindTable(datatable) {
	if(datatable.length > 0) {
		var str = "";
		$.each(datatable, function(index, data) {

			if(parseInt(index) / 2 == 0) {
				str += "<tr class='gradeX odd' role='row'>"
			} else {
				str += "<tr class='gradeX even' role='row'>"
			}
			str += " <td><label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'>";
			str += "<input type='checkbox' class='checkboxes' value='" + data["id"] + "' name='check_table'>";
			str += "<span></span>";
			str += "</label> </td>";
			str += "<td class='sorting_1'>" + data["loginName"] + "</td>";
			str += "<td>" + data["name"] + "</td>";
			str += "<td>" + data["number"] + "</td>";
			str += "<td>" + data["role"] + "</td>";
			str += "<td>" + data["you"] + "</td>";
			str += "</tr>";

		});

	}

	return str;
}

/*复选框操作*/
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
	$("tbody").bind("click", function() {
		var $check = $("input[name='check_table']:checked");
		var ototal = $check.length;

		if($("input[name='check_table']").length == ototal) {
			$("#checkAll").prop("checked", true);
		} else {
			$("#checkAll").prop("checked", false);
		}
	});

	/*删除user_delete*/
	$("#user_delete").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			shconfirm("确定要删除吗", function(result) {
				if(result) {
					/* 对删除进行交互;*/
				}
			});
		}
	});
	$("#del_user").click(function() {
		shalert("删除操作");

	});

	$("#check_cancel").click(function() {
		$("#User_Check").hide();
	});
	/*修改*/
	$("#user_update").click(function() {
		//当复选框已经被选中后
		if(CheckedLength()) {
			$("#user_update").prop("data-toggle", "modal");
			$('#myModal_Update').modal('show')
		}

	});
	/*密码重置*/
	$("#user_password").click(function() {
		if(CheckedLength()) {
			$("#user_password").prop("data-toggle", "modal");
			$('#myModal_PassWordUpdate').modal('show')
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
/*文本框的判定*/
$(function() {

	/*新增*/
	$("#save_Add").click(function() {
		if($("#login_Add").val().trim() == "") {

			shalert("登录名不能为空！");
            $("#login_Add").focus();
			return false;
		}
		if($("#name_Add").val().trim() == "") {
			shalert("姓名不能为空！");
			$("#name_Add").focus();
			return false;
		}
		if($("#inputphone_Add").val().trim() == "") {
			shalert("手机号不能为空！");
			$("#inputphone_Add").focus();
			return false;
		} else {
			var phone = document.getElementById('inputphone_Add').value;
			if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
				shalert("手机号码有误，请重填");
				$("#inputphone_Add").focus();
				return false;
			}
		}
		if($("#inputEmail_Add").val().trim() == "") {
			shalert("邮箱不能为空！");
			$("#inputEmail_Add").focus();
			return false;
		} else {
			var temp = document.getElementById("inputEmail_Add");
			//对电子邮件的验证
			var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if(!myreg.test(temp.value)) {
				shalert('提示\n\n请输入有效的E_mail！');
				$("#inputEmail_Add").focus();
				return false;
			}
		}
		if($("#inputPassword_Add").val().trim() == "") {
			shalert("密码不能为空！");
			$("#inputPassword_Add").focus();
			return false;
		}
		if($("#inputPassword2_Add").val().trim() == "") {
			shalert("请再次填写密码！");
			$("#inputPassword2_Add").focus();
			return false;
		}

		if($("#check_Add").prop("checked") == false) {
			shalert("请选择是否有效！");
			return false;
		}
		if($("#inputPassword_Add").val().trim() != $("#inputPassword2_Add").val().trim()) {
			shalert("两次密码不一致，请重新填写");
			$("#inputPassword2_Add").val("");
			$("#inputPassword2_Add").focus();
			return false;
		}

	});
	/*修改*/
	$("#save_Update").click(function() {
		if($("#login_Update").val().trim() == "") {
			shalert("登录名不能为空！");
			$("#login_Update").focus();
			return false;
		}
		if($("#name_Update").val().trim() == "") {
			shalert("姓名不能为空！");
			$("#name_Update").focus();
			return false;
		}
		if($("#inputphone_Update").val().trim() == "") {
			shalert("手机号不能为空！");
			$("#inputphone_Update").focus();
			return false;
		} else {

			var phone = document.getElementById('inputphone_Update').value;
			if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
				shalert("手机号码有误，请重填");
				$("#inputphone_Update").focus();
				return false;
			}
		}
		if($("#inputEmail_Update").val().trim() == "") {
			shalert("邮箱不能为空！");
			$("#inputEmail_Update").focus();
			return false;
		} else {
			var temp = document.getElementById("inputEmail_Update");
			//对电子邮件的验证
			var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if(!myreg.test(temp.value)) {
				shalert('提示\n\n请输入有效的E_mail！');
				$("#inputEmail_Update").focus();
				return false;
			}
		}

		if($("#check_Update").prop("checked") == false) {
			shalert("请选择是否有效！");
			return false;
		}

	});
	/*密码重置*/
	$("#save_inputPassWordUpdate").click(function() {
		if($("#inputPassWordUpdate").val().trim() != $("#inputPassWordUpdate2").val().trim()) {
			shalert("两次密码不一致，请重新填写");
			$("#inputPassWordUpdate2").val("");
			$("#inputPassWordUpdate2").focus();
			return false;
		}
	});
})