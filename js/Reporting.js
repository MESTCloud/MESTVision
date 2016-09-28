
$(function () {
	
	/*获得Url参数值*/
	/*function getQueryString(name) {
	  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	  var r = window.location.search.substr(1).match(reg);

	  if (r != null) return unescape(r[2]); return null;
	}*/
	
	/*页面title赋值*/
	/*var ptitle = getQueryString("path").split(",");

	for(var i = 0; i < ptitle.length; i++) {
		var option = $('<span></span>').html(ptitle[i]);
		option.appendTo($("#divTitle"));

		if(i < ptitle.length - 1) {
			$("#divTitle").append("<span>-</span>");
		}
	}*/		
	
	/*显示excel*/
	var spread = new GcSpread.Sheets.Spread(document.getElementById('ss'), { sheetCount: 1 });
	
//	/*查询按钮点击事件*/
//	sheetlist.set("name", "index");
//  sheetlist.set("searchAttr", "name");
//  btnQuery.on("click", function () {
//      var stime = startdate.get("displayedValue") + " " + startime.get("displayedValue");
//      var etime;
//      switch (type) {
//          case "hour":
//              stime = startdate.get("displayedValue") + " " + startime.get("displayedValue").substring(0, 2) + ":00:00";
//              etime = startdate.get("displayedValue") + " " + startime.get("displayedValue").substring(0, 2) + ":59:59";
//              break;
//          case "day":
//              etime = startdate.get("displayedValue") + " " + endtime.get("displayedValue");
//              break;
//          case "month":
//              stime = getCurrentMonthFirst(startdate.get("displayedValue")) + " " + startime.get("displayedValue");
//              etime = getCurrentMonthLast(startdate.get("displayedValue")) + " " + endtime.get("displayedValue");
//              break;
//          default:
//              var etime = enddate.get("displayedValue") + " " + endtime.get("displayedValue");
//              break
//      }
//      if (!string.trim(stime)) {
//          alert("不能为空！");
//          return;
//      }
//      ViewerStandby.show();
//      var name = getQueryString("name");
//      var sheet = getQueryString("sheet");
//      
//      if (!!sheetlist.item) {
//          sheet = sheetlist.item.index;
//      } else if (!sheet) {
//          sheet = "0";
//      }
//
//      if (!name) {
//          alert("无报表参数");
//          return;
//      }
//      console.time("报表耗时:");
//      xhr.post("ServerCode/ReportingHandler2.ashx?id=" + escape(name) + "&sheet=" + sheet + "&startime=" + stime + "&endtime=" + etime, {
//          handleAs: "json",
//          preventCache: true
//      }).then(function (data) {
//          if (data.error) {
//              alert(data.error);
//          } else {
//              //fileName = data.filename;
//              //document.getElementById("pdfViewer").src = "PDFJSInNet/web/viewer.html?file=../../" + data.filename;
//              //初始化SheetList
//              //sheetlist.store.setData(data.sheet);
//              //console.log(data);
//              
//              var spread = $("#ss").data("spread");
//              spread.fromJSON(data);
//              //updateSheetList();
//              spreadObj = null;
//              console.timeEnd("报表耗时:");
//          }
//          ViewerStandby.hide();
//      }, function (error) {
//          console.log(error);
//          ViewerStandby.hide();
//      });
//  });
//	
//	/*导出EXCEL按钮点击事件*/
//	btnOutputExcel.on("click", function () {
//    if (fileName) {
//        ViewerStandby.show();
//       window.location.href = "ServerCode/DownHandler.ashx?path=" + fileName.replace(".pdf", ".xls");
//        ViewerStandby.hide();
//    } else {
//        alert("无报表导出");
//    }
//});
//
//	/*导出PDF按钮点击事件*/
//  btnOutputPdf.on("click", function () {
//      if (fileName) {
//          ViewerStandby.show();
//          window.location.href = "ServerCode/DownHandler.ashx?path=" + fileName;
//          ViewerStandby.hide();
//      } else {
//          alert("无报表导出");
//      }
//  });
});

