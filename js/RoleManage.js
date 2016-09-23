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
    /**/
    $("input[name='check_table']").click(function () {
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
        if (!CheckedLength()) {
            $("#del").show();
            return false;
        }else{
        
        	alert("删除操作");
        }
    });
   /* $("#del_Role").click(function(){
        alert("删除操作");
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
        if (total == 0) {
            $("#User_Check").show();
            return false;
        }
        return true;
    }

});
/*文本框的判定*/
$(function () {

    /*新增*/
    $("#Rolesave_Add").click(function () {
      if($("#Name_Add").val().trim()=="")
      {
          alert("姓名不能为空！");
          $("#Name_Add").focus();
          return false;
      }
        if($("#Number_Add").val().trim()=="")
        {alert("编号不能为空！");
            $("#Number_Add").focus();
            return false;
        }
       

        if($("#Role_Add").prop("selected")==false){
            alert("请选择类型！");
            return false;
        }

    });
    /*修改*/
    $("#Rolesave_Update").click(function(){
         if($("#Name_update").val().trim()=="")
      {
          alert("姓名不能为空！");
          $("#Name_update").focus();
          return false;
      }
        if($("#Number_Update").val().trim()=="")
        {alert("编号不能为空！");
            $("#Number_Update").focus();
            return false;
        }
        if($("#Role_Update").val().trim()=="")
        {
            alert("请选择类别！");
            $("#Role_Update").focus();
            return false;
        }
     

     

    });
    /*密码重置*/
    $("#save_inputPassWordUpdate").click(function(){
        if($("#inputPassWordUpdate").val().trim()!=$("#inputPassWordUpdate2").val().trim())
        {
            alert("两次密码不一致，请重新填写");
            $("#inputPassWordUpdate2").val("");
            $("#inputPassWordUpdate2").focus();
            return false;
        }
    });
})