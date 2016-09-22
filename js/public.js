$(function(){
    $("#del_cancel").click(function(){
        $("#del").hide();
    });
    /*提示信息的关闭*/
    $(".cancel").click(function(){
        $(".reminder").hide();
    });
    function info(str)
    {
        $(".context_reminder").html(str);
    }
});


