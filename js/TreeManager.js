~function (jQuery) {
	  function Menu(trclick,treeid){
	  	$(trclick).on("click", function() {
			var $dataid = $(this).attr("data_uid");
			 		$(treeid).find( "a").removeClass("jstree-clicked");
			        active($dataid)
	});
	     var active=function($id)
			{

				 $("#"+$id).find( "a:first").addClass("jstree-clicked");
				var count=0;
				var $alist_length=$("#"+$id).parent().parent().find("li a").length;
				for(var i=0; i<$alist_length;i++)
				{
					if($("#"+$id).parent().parent().find("li a").eq(i).hasClass("jstree-clicked"))
					{
						count++;
					}
				}
				if(count==$alist_length)
				{
					$("#"+$id).parent().parent().find("a").addClass("jstree-clicked");
				}else
				{

					$("#"+$id).parent().parent().find("a:first").removeClass("jstree-clicked").children(":first").addClass("jstree-undetermined");

				}

			}

	  	
	  }
    //->扩展jQuery插件
    jQuery.fn.extend({
        Menu: Menu
    });
}(jQuery);