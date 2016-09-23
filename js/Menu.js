/*MenuManage 页面*/
$(function(){

    /*tree  点击事件*/
    $(".tree li a").on("click",function(){
      console.dir($(this).context );/*context.innerText*/
    });

    /*删除操作*/
    $("#del_Menu").click(function(){
       console.log(this);
    });


});

/*判定*/

$(function(){
  /*添加菜单判定*/
    $("#save_inputTreeAdd").click(function(){
       if($("#input_treeName").val().trim()=="")
        {
            info("姓名不能为空");
            $(".reminder").show();
            $("#input_treeName").focus();
            return false;
        }
        if($("#input_treeNumber").val().trim()=="")
        {
            info("编号不能为空");
            $(".reminder").show();
            $("#input_treeNumber").focus();
            return false;
        }
        if($("#input_treeAddress").val().trim()=="")
        {
            info("网址不能为空");
            $(".reminder").show();
            $("#input_treeAddress").focus();
            return false;
        }
        if($("#input_treeDescribe").val().trim()=="")
        {
            info("网址不能为空！");
            $(".reminder").show();
            $("#input_treeDescribe").focus();
            return false;

        }
        if($("#check-tree_Add").prop("checked")==false){

            info("请勾选公开项！");
            $(".reminder").show();
            return false;
        }
    });
    /*修改菜单项*/
    $("#save_inputTree_Update").click(function(){
        if($("#input_treeName_update").val().trim()=="")
        {
            info("姓名不能为空");
            $(".reminder").show();
            $("#input_treeName_update").focus();
            return false;
        }
        if($("#input_treeNumber_update").val().trim()=="")
        {
            info("编号不能为空");
            $(".reminder").show();
            $("#input_treeNumber_update").focus();
            return false;
        }
        if($("#input_treeAddress_update").val().trim()=="")
        {
            info("网址不能为空");
            $(".reminder").show();
            $("#input_treeAddress_update").focus();
            return false;
        }
        if($("#input_treeDescribe_update").val().trim()=="")
        {
            info("网址不能为空！");
            $(".reminder").show();
            $("#input_treeDescribe_update").focus();
            return false;

        }
        if($("#check_treeUpdate").prop("checked")==false){
            info("请勾选公开项！");
            $(".reminder").show();
            return false;
        }
    });

})
