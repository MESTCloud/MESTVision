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

	});
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
    $("#RoleUser_Add").on("click",function(){
      /*保存内容*/
    });
});