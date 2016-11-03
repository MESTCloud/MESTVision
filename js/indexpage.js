/*屏幕高度*/
var pFrameHeight = $(window).height();

$("#divtable").css("height", pFrameHeight-50);

var oLis=DOM.getElesByClass("tab");//IE6/7/8不支持
var strEvent="onclick";
for(var i=0;i<oLis.length;i++){
	oLis[i][strEvent]=changeTab;//changeTab是不带括号的，表示只是事件绑定，而不是把changeTab的运行结果返回给事件
}

//首先获取所有的类名，给每个类名一个click'方法，
function changeTab(){
	
	var n=DOM.getIndex(this);
	
	/*标题样式变换*/
	//this.className="tab selectedTab";//当前选中的li加上选中的样式
	DOM.addClass(this,"selectedTab");
	
	var siblings=DOM.siblings(this);//再得到其它的li

	for(var i=0;i<siblings.length;i++){
		//siblings[i].className="tab";//把其它的li的selectedTab去掉
		
		DOM.removeClass(siblings[i],"selectedTab");
	}
	
	
	//var contents=this.parentNode.nextElementSibling.children;
	/*内容显示*/
	var contents=DOM.children(DOM.next(this.parentNode));
	
	for(var i=0;i<contents.length;i++){
		console.log(contents[i]);
		//contents[i].className="content";	
		DOM.removeClass(contents[i],"selectedContent");
	}
	
	//contents[n].className="content selectedContent";
	DOM.addClass(contents[n],"selectedContent");
	
}
