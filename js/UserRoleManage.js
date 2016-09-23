$(function(){
	$(".userRole_left tbody tr").on("click",function(){
		var $roleid=$(this).attr("data_roleid");
		if($roleid!="undefined"){
		var $inputr=$(".userRole_right tbody tr input");
		
		for(var i=0;i<$inputr.length;i++){
			$inputr.eq(i).prop('checked', false);
			if($inputr.eq(i).attr("data-rid")==$roleid){
				$inputr.eq(i).prop('checked', true);
			}
		}
		}
	});
	/*保存*/
	$("#userRole_Add").on("click",function(){
		{
			/*保存操作*/
		}
	})
});
