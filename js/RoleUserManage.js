$(function() {
	$(".Roleuser_left tbody tr").on("click", function() {
		$(this).prop("cursor", "pointer");
		var $rid = $(this).attr("data-rid");
		var $rightr = $(".Roleuser_right tbody tr");
		var count = 0;

		for(var i = 0; i < $rightr.length; i++) {
			$rightr.eq(i).find("input").prop('checked', false);

			if($rightr.eq(i).attr("data_roleid") == $rid) {
				$rightr.eq(i).find("input").prop('checked', true);
				count++;
			}
		}
		if(count != 0) {
			$("#checkAll").prop('checked', true);
		} else {
			$("#checkAll").prop('checked', false);
		}

	})
    $("#RoleUser_Add").on("click",function(){
      /*保存内容*/
    });
});