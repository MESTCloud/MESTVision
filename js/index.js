$(function(){

    /*�˵������ ���ѡ����ʽ*/
    $(".sub-menu>li").click(function(){
     $(".sub-menu").children("li").removeClass("active open");
        $(this).addClass("active open");
        $(this).parent().parent().addClass("active").siblings().removeClass("active");

        var $page=$(this).find("a").attr("data-page");
        console.log($page);
        
        $("#iframepage").attr("src",$page);

    });

})
function iFrameHeight() {
    var ifm = document.getElementById("iframepage");
    var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;
    if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
    }

}
