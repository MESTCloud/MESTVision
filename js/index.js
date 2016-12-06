/*重置密码确定按钮点击事件*/
$("#save_inputPassWordUpdate").click(function() {
	if($("#inputPassWordUpdateOld").val().trim() == "") {
		shalert("旧密码不能为空");
		return false;
	}
	if($("#inputPassWordUpdate").val().trim() == "" || $("#inputPassWordUpdate2").val().trim() == "") {
		shalert("密码不能为空");
		return false;
	}
	if($("#inputPassWordUpdate").val().trim() != $("#inputPassWordUpdate2").val().trim()) {
		shalert("两次密码不一致，请重新填写");
		$("#inputPassWordUpdate2").val("");
		$("#inputPassWordUpdate2").focus();
		return false;
	}
	var jsonStr = "ChangePassword {\"oldPassword\":\"" + $("#inputPassWordUpdateOld").val().trim() + "\",\"newPassword\":\"" + $("#inputPassWordUpdate").val().trim() + "\"}";

	send(jsonStr);
});

/*登录用户加载*/
$("#userLoginName").html($.cookie("realName"));

//连接成功
socket.onopen = function() {

	if($.cookie("user") && $.cookie("password")) {
		socket.send("Login {\"username\":\"" + $.cookie("user") + "\",\"password\":\"" + $.cookie("password") + "\"}");
	}
	send("ModuleListByMenu");
}

//收到消息
socket.onmessage = function(msg) {
	var result = msg.data;
	result = JSON.parse(result);
	if(result["error"]) {

		if($.cookie("user") == "" || $.cookie("user") == null) {
			shconfirm1(result["error"], function(result) {
				if(result) {
					location.href = "Login.html";
				}
			});
		} else {
			shalert(result["error"]);
		}

	}
	/*else if(result["exception"]) {
	
		shalert(result["exception"]);
	}*/
	else {
		switch(result["Function"]) {

			case "ChangePassword":

				if(result["info"].toString().trim() != "") {
					shalert(result["info"]);
				} else {
					shalert("密码修改成功！");
				}
				$("#inputPassWordUpdateOld").val("");
				$("#inputPassWordUpdate").val("");
				$("#inputPassWordUpdate2").val("");
				$('#myModal_PassWordUpdate').modal('hide');
				break;
			case "ModuleListByMenu":
				$("#Menu").html('<li class="sidebar-toggler-wrapper hide"><div class="sidebar-toggler"><span></span></div></li>' + result["data"]);

				/*屏幕高度*/
				var pFrameHeight = $(window).height();

				//var pTreeItseltHeight;

				$(".sub-menu > li").click(function() {

						/*title的上边高度*/
						var pTitleHeight = $(this).parent().offset().top;
						/*下边高度*/
						var pTreeHeight = pFrameHeight - pTitleHeight - 20;

						/*二级菜单的高度*/
						var pTwoHeight = $(this).parent().height();

						/*三级菜单的高度*/
						var pThressHeight = $(this).find("> ul").height();

						//console.log($(this)["context"].innerHTML.indexOf('open'));

						if($(this).parent().attr("style") == undefined && $("#Menu").attr("class").indexOf("page-sidebar-menu-closed") >= 0) {
							if((pThressHeight + pTwoHeight) > pTreeHeight) {
								$(this).parent().css("overflow-y", "auto");
								$(this).parent().css("height", pTreeHeight);
							}
						}
					 else {
						$(this).parent().removeAttr("style");
				}
					 
					 //if ($(this)["context"].innerHTML.indexOf('open') >= 0)

				/*if($(this).parent().attr("style") != undefined && $(this).parent().attr("style").indexOf("display: block") < 0) {
					
					$(this).parent().removeAttr("style");
				} else {
					if((pThressHeight + pTwoHeight) > pTreeHeight) {
						$(this).parent().css("overflow-y", "auto");
						$(this).parent().css("height", pTreeHeight);
					}
				}*/

				/*if($(this).parent().attr("style") == undefined) {
					if((pThressHeight + pTwoHeight) > pTreeHeight) {
						$(this).parent().css("overflow-y", "auto");
						$(this).parent().css("height", pTreeHeight);
					}
				} else if($(this).parent().attr("style").indexOf("display: block") >= 0) {
					if((pThressHeight + pTwoHeight) > pTreeHeight) {
						$(this).parent().css("overflow-y", "auto");
						$(this).parent().css("height", pTreeHeight);
					}
				} else if($(this).parent().attr("style") != undefined) {
					$(this).parent().removeAttr("style");
				}*/

				var menu = $('.page-sidebar-menu');

				var el = $(this);

				if(!el || el.size() == 0) {
					return;
				}

				if(el.attr('href') == 'javascript:;' ||
					el.attr('ui-sref') == 'javascript:;' ||
					el.attr('href') == '#' ||
					el.attr('ui-sref') == '#'
				) {
					return;
				}

				// begin: handle active state
				if(menu.hasClass('page-sidebar-menu-hover-submenu') === false) {

					menu.find('li.nav-item.open').each(function() {
						//alert(1);
						$(this).removeClass('open');
						$(this).find('> a > .arrow.open').removeClass('open');
						//$(this).find('> .sub-menu').slideUp();

						/*ul高度*/
						//pTreeItseltHeight = $(this).find('> .sub-menu').height();
					});
				} else {
					menu.find('li.open').removeClass('open');
				}

				menu.find('li.active').removeClass('active');
				menu.find('li > a > .selected').remove();

				el.parents('li').each(function() {
					$(this).addClass('active');
					$(this).find('> a > span.arrow').addClass('open');

					if($(this).parent('ul.page-sidebar-menu').size() === 1) {
						$(this).find('> a').append('<span class="selected"></span>');
					}

					if($(this).children('ul.sub-menu').size() === 1) {
						$(this).addClass('open');

					}

					/*ul高度*/
					//pTreeItseltHeight = $(this).children().children().find("ul").height();
				});

				if($(this).find('> a').attr('data-page')) {
					var path = new Array();

					while(true) {
						if(el.parent('ul.page-sidebar-menu').size() === 1) {
							path.push(el.find(' > a > span.title')[0].textContent);
							break;
						} else {
							if(el.find(' > a > span.title')[0]) {
								path.push(el.find(' > a > span.title')[0].textContent);
							}
						}

						el = el.parent();
					}

					var url = $(this).find('> a').attr('data-page');
					if(url.indexOf('?') > -1) {
						url += "&path=" + escape(path.reverse());
					} else {
						url += "?path=" + escape(path.reverse());
					}

					$("#ShowPage").attr("src", url);
				}

				var resBreakpointMd = App.getResponsiveBreakpoint('md');
				if(App.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass('in')) { // close the menu on mobile view while laoding a page 

					if($(this).find('> a').attr('data-page') != undefined) {
						$('.page-header .responsive-toggler').click();
					}
				}
		});

	break;
}
}
}

socket.onclose = function(event) {
	location.href = "Login.html";
}

//发送
function send(msg) {
	socket.send(msg);
}

//断开连接
function disconnect() {
	socket.close();
}