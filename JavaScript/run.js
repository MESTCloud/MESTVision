var timerId = null;
var firstExecuteAnimate = true;
//原始的矩阵信息
var orignTransform = new Array();
var curTransformAnimate = 0;
var PRECISION = 0.0000001;
var dashOffset = 0;
var tags = new Array();
var tagsObjArray = new Array();
var xValues = new Array();
var yValues = new Array();
var currentTime = 0;
var cacheDb = null;
var snapshotData;
var timeTag = "#time";

//颜色值转为#RRGGBB
function RGB(color)
{
	var rgb = Number(color).toString(16);
	var tmp="000000";
	tmp = tmp.substring(0,6-rgb.length) + rgb;
	rgb = ("#" + tmp.substring(4) + tmp.substring(2,4) + tmp.substring(0,2));
	return rgb;
}

//数据采集		
function onDataAcquire()
{
	//获取数据
	getData(tags);
	//判断快照是否为空
	if(snapshotData != null)
	{
		for(var i=0; i<snapshotData.length; i++)
		{
			cacheDb.PutSnapshot(snapshotData[i].TagName,currentTime,snapshotData[i].Value);
		}
	}

	cacheDb.PutSnapshot(timeTag,currentTime,currentTime);
}

function getTags()
{
    var animateRoot = document.querySelectorAll("[tag]");
    
    //增加数据是否为空检查
    if (animateRoot == null) return;
    for (var i = 0; i < animateRoot.length; i++) {
        tagsObjArray.push(animateRoot[i]);
        tags.push(animateRoot[i].getAttribute("tag"));
    }
}

//浮点数与0比较
function isZero(value)
{
	return Math.abs(value) < PRECISION ? true:false;
}

//判断数据是否在给定区间范围内
function between(min,max,value,intervalType)
{
	var bIn = (value > min && value < max);
	switch (intervalType)
	{
		//左开右开(min,max)
	case "LORO":
		{
			return bIn;
		}
		break;
		//左开右闭(min,max]
	case "LORC":
		{
			return (bIn || isZero(value-max));
		}
		break;
		//左闭右开[min,max)
	case "LCRO":
		{
			return (bIn || isZero(value-min));
		}
		break;
		//左闭右闭[min,max]
	case "LCRC":
		{
			return (bIn || isZero(value-min) || isZero(value-max));
		}
		break;
	}
	return false;
}

//缓存DB
function CacheDb()
{
	this.values = {};						//格式为{tagName1:[[time1,value1],[time2,value2]],tagName2:[[time1,value1],[time2,value2]]}数组索引为ID索引
	this.maxValuePerTag = 1800;				//每个标签点的缓存数据个数主要用于实时曲线与回放
	//点名数组初始化数据库
	this.Init = function(tags)
	{
		for(var i=0; i<tags.length; i++)
		{
			this.values[tags[i]] = [];
		}
		this.values[timeTag] = [];
	}
	
	//添加标签点实时值
	this.PutSnapshot = function(tagName,tm,value)
	{
		var count = this.values[tagName].length;
		var pos = count;
		//如果超过最大个数则从头删除
		if (count >= this.maxValuePerTag)
		{
			//delete删除数组元素后数组长度不变并且不移动数据元素而shift会从头部删除元素并且向下移动数组元素
			this.values[tagName].shift();
			//delete this.values[tagName][0];
			pos = this.maxValuePerTag-1;
		}
		this.values[tagName][pos] = [tm,value];
	}
	
	//获得标签点实时值
	this.GetSnapshot = function(tagName,num)
	{
		var count = this.values[tagName].length;
		var values = [];
		if (count > 0)
		{
			if (num === undefined)
			{
				num = 1;
			}
			else if (num > count)
			{
				num = count;
			}	
			var j=0;
			for (var i=count-num;i<count;i++)
			{
				values[j] = [this.values[tagName][i][0],this.values[tagName][i][1]];
				j = j+1;
			}
			return values;
		}	
	}
}

//svg矩阵类
function Matrix2D()
{
	this.matrix = [1.0,0.0,0.0,1.0,0.0,0.0];
	
	//设置矩阵元素
	this.set = function(xx,yx,xy,yy,x0,y0)
	{
		this.matrix[0] = xx;
		this.matrix[1] = yx;
		this.matrix[2] = xy;
		this.matrix[3] = yy;
		this.matrix[4] = x0;
		this.matrix[5] = y0;
	}
	
	//设置平移矩阵
	this.setToTranslate = function(xOffset,yOffset)
	{
		this.set(1,0,0,1,xOffset,yOffset);
	}
	
	//设置旋转矩阵
	this.setToRotate = function(angle,centerX,centerY)
	{
		//转为弧度
		angle *= Math.PI/180;
		
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		
		this.set(c,s,-s,c,(1-c)*centerX + s*centerY,(1-c)*centerY - s*centerX);
	}
	
	//设置缩放矩阵
	this.setToScale = function(xScale,yScale,centerX,centerY)
	{
		this.set(xScale,0,0,yScale,(1-xScale)*centerX,(1-yScale)*centerY);
	}
	
	//设置为两个矩阵的乘积 (m * n)
	this.setToProduct = function(m,n)
	{
		this.set(m[0]*n[0] + m[2]*n[1],m[1]*n[0] + m[3]*n[1],m[0]*n[2] + m[2]*n[3],m[1]*n[2] + m[3]*n[3],
				m[0]*n[4] + m[2]*n[5] + m[4],m[1]*n[4] + m[3]*n[5] + m[5]);
	}
	
	//左乘矩阵
	this.preMultBy = function(leftMat)
	{
		this.setToProduct(leftMat.matrix,this.matrix);
	}

	//右乘矩阵
	this.postMultBy = function(rightMat)
	{
		this.setToProduct(this.matrix,rightMat.matrix);
	}
	
	//转为svg矩阵字符串
	this.toSvgMatrix = function()
	{
		var svgMatrix = "matrix(";
		for(var i=0; i<5; i++)
		{
			svgMatrix += this.matrix[i].toFixed(6);
			svgMatrix += ",";
		}
		svgMatrix += this.matrix[5].toFixed(6);
		svgMatrix += ")";
		
		return svgMatrix;
	}
	
	//将svg矩阵字符串转为矩阵
	this.fromSvgMatrix = function(svgMatrix)
	{
		//提取矩阵字符串
		var matrix = svgMatrix.substring(7,svgMatrix.length-1);
		//采用空格或逗号分割IE11获取矩阵属性时会采用空格分隔而Google Chrome、FireFox及Safari会保持原有逗号
		var split = " "
		if(matrix.indexOf(",") != -1)
		{
			split = ",";
		}
		var arr = matrix.split(split);
		for(var i=0; i<6; i++)
		{
			this.matrix[i] = Number(arr[i]);
		}
	}
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("%Y-%m-%d %H:%M:%S:%ms") ==> 2006-07-02 08:09:04:423   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
	"%Y" : this.getFullYear(),                //年
    "%m" : this.getMonth()+1,                 //月份   
    "%d" : this.getDate(),                    //日   
    "%H" : this.getHours(),                   //小时   
    "%M" : this.getMinutes(),                 //分   
    "%S" : this.getSeconds(),                 //秒    
    "%ms": this.getMilliseconds()          	  //毫秒   
  };   
  for(var k in o)  
  {
	//alert(o[k].length);
	if(k == "%ms")
	{
		if(	o[k] < 10)
		{
			//不足三位补两个0
			fmt = fmt.replace(k, "00" + o[k]);  
		}
		else if(o[k] < 100)
		{
			//不足三位补一个0
			fmt = fmt.replace(k, "0" + o[k]);
		}
		else
		{
			fmt = fmt.replace(k,o[k]);
		}
	}
	else
	{
		//不足两位补0
		fmt = fmt.replace(k,o[k] < 10 ? "0" + o[k] : o[k]);  
	}	 
  }    
  return fmt;   
} 

//执行数据输出动画
function executeOutputAnimate(animate)
{
	//获取图元ID
	var drawObjId = animate.getAttribute("drawObjId");
	//根据图元ID获取文本图元对象
	var text = svgRoot.getElementById(drawObjId);
	//获取数据ID
	var dataId = animate.getAttribute("dataId");
	//获取数据位置
	var pos = animate.getAttribute("dataPosition");
	//根据ID获取数据
	var values = cacheDb.GetSnapshot(dataId);
	//判断是否存在数据
	if(values != null)
	{
		var currentValue = values[0][1];
		//获得数据格式
		var dataFormat = animate.getAttribute("dataFormat");
		if(dataFormat.indexOf("%s") != -1)
		{
			//字符串输出
			currentValue = dataFormat.replace("%s",currentValue);
			text.textContent = currentValue;
		}
		else if(dataFormat.indexOf("%d") != -1)
		{
			//字符串输出
			currentValue = dataFormat.replace("%d",currentValue);
			text.textContent = currentValue;
		}
		else if(dataId == timeTag)
		{
			//时间格式
			var time = currentTime + pos*1000;
			var newdate = new Date;
			newdate.setTime(time);
			text.textContent = newdate.Format(dataFormat);
			//text.textContent = newdate.toLocaleString();
		}
		else
		{
			//正则表达式匹配(%.nnf)
			var reg = /\%\.[1-9][0-6]*f/;
			var ftms = dataFormat.match(reg);
			if(ftms != null)
			{
				var frm = ftms[0];
				//需转为数值型数据计算
				currentValue = Number(currentValue);
				//获取小数位数
				var num = frm.substring(2,frm.length-1);
				currentValue = currentValue.toFixed(Number(num));
				currentValue = dataFormat.replace(frm,currentValue);
				text.textContent = currentValue;
			}
		}
	}	
}
					
//svg加载时初始化函数				
function init(evt)
{
	svgDoc = evt.target.ownerDocument;
	svgRoot = svgDoc.rootElement;
	//cacheDb = new CacheDb();

	var linkOjb = document.querySelectorAll("[link]");
	
	for (var i = 0; i < linkOjb.length; i++) {
	    linkOjb[i].onclick = function () {
	        parent.location.href = parent.location.href.replace(getQueryString("name"), this.getAttribute("link"));
	    }
	}

	//获得标签点
	getTags();
	//初始化缓存DB
	//cacheDb.Init(tags);
	//设置定时器函数
	//timerId = self.setInterval("onTimer()", 1000);
    //连接WebSocket
	connect(tags);
    //发送数据
	//send(tags);
}

//定时器
function onTimer()
{
	//数据采集		
    onDataAcquire();
	
    executeOutputAnimate(animate);

	firstExecuteAnimate = false;
	curTransformAnimate = 0;
}

function getData(tag) {
    if (tag == null || tag.length <= 0) return null;
    var tagStr = "";
    for (var i = 0; i < tag.length; i++) {
        if (tag[i]==null||tag[i].length <= 0) {
            continue;
        }
        if (i == tag.length - 1) {
            tagStr += tag[i];
        } else {
            tagStr += tag[i] + ",";
        }
    }
    $.ajax({
        url: 'http://192.168.1.130:10086/api/Snapshot?tagName=' + tagStr,
        type: 'GET',
        cache: false,
        success: function (data) {
            if (data == null) return new [];
            snapshotData = eval(data);
        }
    });
}

//全局Socket对象
var socket;
var myid = 0;

//连接至服务器
function connect(tags) {
    var readyStatus = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
    var host = "ws://36.110.66.3:29001";

    //尝试连接至服务器
    try {
        socket = new WebSocket(host);
    } catch (exception) {
        console.log("对不起，您所使用的浏览器不支持WebSocket.");
        return;
    }
    //连接成功
    socket.onopen = function () {
        if (tags.length > 0) {
            socket.send(tags);
        }
    }
    //收到消息
    socket.onmessage = function (msg) {
        if (!msg.data) return;
        if (msg.data == "确认连接成功") return;
        var dataJson = JSON.parse(msg.data);
        //var dataJson = eval('(' + msg.data + ')');
        var item = null;
        var ditem = null;
        for (var i=0; i < tagsObjArray.length; i++) {
            item = tagsObjArray[i];
            for (var j=0; j < dataJson.length; j++) {
                //data.Data.forEach(function (ditem) {
                ditem = dataJson[j];
                if (item.getAttribute("tag").toLowerCase() == ditem.Tagname.toLowerCase()) {
                    if (item.getAttribute("tag").toLowerCase() == "ahhx_gcs1201") {
                        ditem.Value = Math.round(Math.random() * 1)
                    }
                    if (item.getAttribute("tag").toLowerCase() == "ahhx_gcs1202") {
                        ditem.Value = Math.round(Math.random() * 1)
                    }
                    switch (item.getAttribute("type")) {
                        case "TimeStamp":
                            item.firstChild.nodeValue = ditem.TimeStamp;
                            break;
                        case "state":
                            var updateDate = new Date(ditem.TimeStamp.replace(/-/g, "/"));
                            var nowDate = new Date();
                            //5分钟数据不更新视为通讯中断
                            if ((nowDate - updateDate) / 1000 / 60 >= 5) {
                                item.style.fill = "red";
                                item.firstChild.nodeValue = "中断";
                            } else {
                                if (item.firstChild.nodeValue != "正常") {
                                    item.style.fill = "green";
                                    item.firstChild.nodeValue = "正常";
                                }
                            }
                            break;
                        case "Level":
                            var per = ditem.Value / item.getAttribute("max") > 1 ? 1 : ditem.Value / item.getAttribute("max");
                            if (!item.getAttribute("max-height")) item.setAttribute("max-height", item.getAttribute("height"));
                            var changed = item.getAttribute("max-height") * per;
                            item.setAttribute("y", parseFloat(item.getAttribute("y")) + parseFloat(item.getAttribute("height")) - changed);
                            item.setAttribute("height", changed);
                            break;
                        case "switch":
                            if (!item.getAttribute("cx")) item.setAttribute("cx", item.getAttribute("x2"));
                            if (ditem.Value == 0) {
                                item.setAttribute("x2", item.getAttribute("x1"));
                            } else {
                                item.setAttribute("x2", item.getAttribute("cx"));
                            }
                            break;
                        case "alarm":
                            if (ditem.Value == 0) {
                                item.style.fill = "green";
                            } else {
                                item.style.fill = "red";
                            }
                            break;
                        case "alarmText":
                            if (ditem.wValue == 0) {
                                item.style.fill = "green";
                                item.firstChild.nodeValue = "正常";
                            } else {
                                item.style.fill = "red";
                                item.firstChild.nodeValue = "故障";
                            }
                            break;
                        case "status":
                            if (ditem.Value == item.getAttribute("value")) {
                                item.style.display = "block";
                            } else {
                                item.style.display = "none";
                            }
                            break;
                        default:
                            var resultValue = 0;
                            switch (item.getAttribute("dataFormat")) {
                                case "%d":
                                    resultValue = parseFloat(ditem.Value).toFixed(0);
                                    break
                                default:
                                    var reg = /\%\.[1-9][0-6]*f/;
                                    var ftms = item.getAttribute("dataFormat");
                                    if (ftms != null) {
                                        ftms = item.getAttribute("dataFormat").match(reg);
                                        var frm = ftms[0];
                                        //需转为数值型数据计算
                                        resultValue = Number(ditem.Value);
                                        //获取小数位数
                                        var num = frm.substring(2, frm.length - 1);
                                        resultValue = resultValue.toFixed(Number(num));
                                    } else {
                                        resultValue = ditem.Value;
                                    }
                                    break;
                            }

                            //item.firstChild.nodeValue = resultValue;
                            item.textContent = resultValue;
                            break
                    }
                }
            };
        };

        //返回的数据msg.data，包含了协议中的4部分
        //var arrays = msg.data.split(',');
        //if (arrays.length != 2) return;
        //if (arrays[0] == "MSG") {
        //    console.log(arrays[1]);
        //}
    }
    //连接断开
    socket.onclose = function (event) {
        console.log("Socket状态:" + readyStatus[socket.readyState]);
    }
}

//发送
function send(tags) {
    try {
        if (socket.readyState == "1") {
            socket.send("MSG," + myid + ",0," + tags + ",|");
        } else {
            connect(tags);
            //socket.send("MSG," + myid + ",0," + tags + "|");
        }
    }
    catch (exception) {
        console.log(exception);
        console.log("发送数据出错.");
    }
}

//断开连接
function disconnect() {
    socket.close();
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = parent.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}