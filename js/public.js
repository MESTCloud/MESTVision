$(function(){
    $("#del_cancel").click(function(){
        $("#del").hide();
    });
    /*��ʾ��Ϣ�Ĺر�*/
    $(".cancel").click(function(){
        $(".reminder").hide();
    });
    function info(str)
    {
        $(".context_reminder").html(str);
    }
});


