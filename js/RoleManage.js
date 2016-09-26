/*交互*/
/*$(function () {
    $.ajax({
        url: "../js/json",
        type: "get",
        dataType: "json",
        success: function (data) {
            $("tbody").html(bindTable(data));
        }
    });
});*/
/*获取集合*/
/*function bindTable(datatable) {
    if (datatable.length > 0) {
        var str = "";
        $.each(datatable, function (index, data) {

            if (parseInt(index) / 2 == 0) {
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
}*/
/*复选框操作*/
$(function () {
    /*全选 反选*/
    $("#checkAll").click(
        function () {
            if (this.checked) {
                $("input[name='check_table']").prop('checked', true);

            } else {
                $("input[name='check_table']").prop('checked', false);

            }
        }
    );

    $("tbody").click(function () {
        var $check = $("input[name='check_table']:checked");
        var ototal = $check.length;

        if ($("input[name='check_table']").length == ototal) {
            $("#checkAll").prop("checked", true);
        } else {
            $("#checkAll").prop("checked", false);
        }


    });
    /*删除user_delete*/
    $("#Role_delete").click(function () {
        //当复选框已经被选中后
        if (CheckedLength()) {
           	shconfirm("确定要删除吗", function(result) {
				if(result) {
					/* 对删除进行交互;*/
				}
			});
        }
    });
   /* $("#del_Role").click(function(){
        shalert("删除操作");
    });*/

    $("#check_cancel").click(function(){
        $("#User_Check").hide();
    });
    /*修改*/
    $("#Role_update").click(function () {
        //当复选框已经被选中后
        if (CheckedLength()) {
            $("#user_update").prop("data-toggle", "modal");
            $('#myModal_Update').modal('show')
        }

    });
 
    /*对全选项的判定*/
    function CheckedLength() {
        var oChecked = document.getElementsByName("check_table");
        var total = 0;
        for (var i = 0; i < oChecked.length; i++) {
            if (oChecked[i].checked) {
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
$(function () {

    /*新增*/
    $("#Rolesave_Add").click(function () {
      if($("#Name_Add").val().trim()=="")
      {
          shalert("姓名不能为空！");
          $("#Name_Add").focus();
          return false;
      }
        if($("#Number_Add").val().trim()=="")
        {shalert("编号不能为空！");
            $("#Number_Add").focus();
            return false;
        }
       

        if($("#Role_Add").prop("selected")==false){
            shshalert("请选择类型！");
            return false;
        }

    });
    /*修改*/
    $("#Rolesave_Update").click(function(){
         if($("#Name_update").val().trim()=="")
      {
          shalert("姓名不能为空！");
          $("#Name_update").focus();
          return false;
      }
        if($("#Number_Update").val().trim()=="")
        {shalert("编号不能为空！");
            $("#Number_Update").focus();
            return false;
        }
        if($("#Role_Update").val().trim()=="")
        {
            shalert("请选择类别！");
            $("#Role_Update").focus();
            return false;
        }
     

     

    });
    /*密码重置*/
    $("#save_inputPassWordUpdate").click(function(){
        if($("#inputPassWordUpdate").val().trim()!=$("#inputPassWordUpdate2").val().trim())
        {
            shalert("两次密码不一致，请重新填写");
            $("#inputPassWordUpdate2").val("");
            $("#inputPassWordUpdate2").focus();
            return false;
        }
    });
})