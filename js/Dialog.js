/// <summary>
/// 询问对话框
/// </summary>
/// <param name="title">title文字</param>
/// <param name="type">信息类型{ok,warning,error,info,question}</param>
/// <param name="content">显示提示文字</param>
/// <param name="callback">回调函数</param>
/// <remarks>创建人员(日期): ★Ariel★(130809 22:04)</remarks>
/*
function dojoConfirm(title, type, content, callback) {
    require(["dojo/on", "dijit/registry", "dijit/Dialog", "dijit/form/Button"], function (on, registry, Dialog) {
        var img = getImg(type);

        content = "<div style='background-image:url(//127.0.0.1/MESTResource/Img/" + img + ".png); background-repeat:no-repeat; width:200px; height:40px'>" +
                  "<div style='margin-left:50px; margin-top:5px; width:160px; height:40px; overflow:auto; '>" + content + "</div></div>" +
			      "<div style='text-align:center;'><button data-dojo-type='dijit.form.Button' id='yesButton'>确定</button>" +
			      "<button data-dojo-type='dijit.form.Button' id='noButton'>取消</button></div>";

        var confirmDialog = new Dialog({
            id: "confirmDialog",
            title: title,
            content: content,
            closable: false,
            onHide: function () {
                this.destroyRecursive();
            }
        });

        confirmDialog.startup();

        var yesButton = registry.byId("yesButton");
        var noButton = registry.byId("noButton");
        //若是点击确定按钮
        on(yesButton, "click", function (mouseEvent) {
            confirmDialog.hide();
            callback();
        });

        //若是点击取消按钮
        on(noButton, "click", function (mouseEvent) {
            confirmDialog.hide();
        });

        confirmDialog.show();
    });
}
*/
/// <summary>
/// 提示对话框
/// </summary>
/// <param name="title">title文字</param>
/// <param name="type">信息类型{ok,warning,error,info,question}</param>
/// <param name="content">显示提示文字</param>
/// <remarks>创建人员(日期): ★Ariel★(130809 22:04)</remarks>

/*function dojoInfoDialog(title, type, content) {
    require(["dojo/on", "dijit/registry", "dijit/Dialog", "dijit/form/Button"], function (on, registry, Dialog) {
        var img = getImg(type)

        content = "<div style='background-image:url(//127.0.0.1/MESTResource/Img/" + img + ".png); background-repeat:no-repeat; width:200px; height:40px'>" +
                  "<div style='margin-left:50px; margin-top:5px; width:160px; height:40px; overflow:auto; '>" + content + "</div></div>" +
			      "<br/><div style='text-align:center;'><button data-dojo-type='dijit.form.Button' id='yesInfoButton'>确定</button></div>";

        var infoDialog = new Dialog({
            id: "infoDialog",
            title: title,
            content: content,
            closable: false,
            onHide: function () {
                this.destroyRecursive();
            }
        });

        infoDialog.startup();

        var yesButton = registry.byId("yesInfoButton");

        //若是点击确定按钮
        on(yesButton, "click", function (mouseEvent) {
            infoDialog.hide();
        });

        infoDialog.show();
    });
}
*/
/// <summary>
/// Form操作对话框
/// </summary>
/// <param name="title">title文字</param>
/// <param name="content">Form元素,结文本框等</param>
/// <param name="paraJson">默认值,绑架时使用</param>
/// <param name="callback">回调函数</param>
/// <remarks>创建人员(日期): ★Ariel★(130809 22:04)</remarks>
/*
function dojoFormDialog(title, content, paraJson, callback) {
    require(["dojo/on", "dijit/registry", "dijit/Dialog", "dijit/form/Button"], function (on, registry, Dialog) {
        if (!!!content) {
            content = "<div style='width:300px; text-align:center;' id='myForm'>" +
                        "<div class='formDialogLayout'>" +
                            "<label for='txtTypeName'>类型名称：</label>" +
                            "<input type='text' id='txtTypeName' value='' data-dojo-type='dijit/form/ValidationTextBox' data-dojo-props='required:true' />" +
                        "</div>" +
                        "<div class='formDialogLayout'>" +
                            "<label for='orderNum'>排列顺序：</label>" +
                            "<div id='orderNum' data-dojo-type='dijit/form/NumberSpinner' data-dojo-props='constraints:{min:0,max:999}, value:0'></div>" +
                        "</div>" +
                        "<div class='formDialogLayout'>" +
                            "<label for='chkEnable'>是否可用：</label>" +
                            "<input id='chkEnable' data-dojo-type='dijit/form/CheckBox' checked />" +
                        "</div>" +
                        "<div style='text-align:center;'>" +
                            "<button id='yesFormDialogButton' data-dojo-type='dijit/form/Button'>提交</button>" +
                            "<button id='noFormDialogButton' data-dojo-type='dijit/form/Button'>取消</button>" +
                        "</div>" +
                    "</div>";
        }

        var formDialog = new Dialog({
            id: "formDialog",
            title: title,
            content: content,
            closable: false,
            onHide: function () {
                this.destroyRecursive();
            }
        });

        formDialog.startup();

        if (!!paraJson) {
            registry.byId("txtTypeName").setValue(paraJson.name);
            registry.byId("orderNum").setValue(paraJson.num);
            registry.byId("chkEnable").setChecked(paraJson.enable.toLocaleLowerCase() == "true");
        }

        var yesButton = registry.byId("yesFormDialogButton");
        var noButton = registry.byId("noFormDialogButton");
        //若是点击确定按钮
        on(yesButton, "click", function (mouseEvent) {
//            if (registry.byId("myForm").validate()) {
                formDialog.hide();
                callback(registry.byId("txtTypeName").getValue(), registry.byId("orderNum").getValue(), registry.byId("chkEnable").checked);
//            }
        });

        //若是点击取消按钮
        on(noButton, "click", function (mouseEvent) {
            formDialog.hide();
        });

        formDialog.show();
    });
}
*/
function WriteFloatValue(tag) {
   alert("tag");
   require(["dojo/on",
        "dojo/request/xhr",
        "dijit/registry",
        "dijit/Dialog",
        "dijit/form/Button",
        "dijit/form/NumberSpinner"],
        function (on, xhr, registry, Dialog, NumberSpinner) {
            var title1 = "写入数据[" + tag + "]";
        var content = "<div style='width:250px; text-align:center;' id='myForm'>" +
                    "<div class='formDialogLayout'>" +
                        "<label for='inputValue'>写入值：</label>" +
                        "<div id='inputValue' data-dojo-type='dijit/form/NumberSpinner' data-dojo-props='value:0'></div>" +
                    "</div>" +
                    "<div style='text-align:center;'>" +
                        "<button id='yesFormWriteFloatButton' data-dojo-type='dijit/form/Button'>提交</button>" +
                        "<button id='noFormWriteFloatButton' data-dojo-type='dijit/form/Button'>取消</button>" +
                    "</div>" +
                "</div>";

        var formWriteFloat = new Dialog({
            id: "formWriteFloat",
            title: title1,
            content: content,
            closable: false,
            onHide: function () {
                this.destroyRecursive();
            }
        });

        formWriteFloat.startup();

        var yesButton = registry.byId("yesFormWriteFloatButton");
        var noButton = registry.byId("noFormWriteFloatButton");
        //若是点击确定按钮

        on(yesButton, "click", function (mouseEvent) {
            xhr.post("ServerCode/InputHandler.ashx?tag=" + tag + "&value=" + registry.byId("inputValue").getValue(), {
                handleAs: "json",
                preventCache: true
            }).then(function (data) {
                if (data.error) {
                    console.log(data.error);
                }
            }, function (error) {
                console.log(error);
                formWriteFloat.hide();
            });
            formWriteFloat.hide();
        });

        //若是点击取消按钮
        on(noButton, "click", function (mouseEvent) {
            formWriteFloat.hide();
        });

        formWriteFloat.show();
    });

}

function WriteBoolValue(tag) {
	alert(tag);
    require(["dojo/on",
        "dojo/request/xhr",
        "dijit/registry",
        "dijit/Dialog",
        "dijit/form/Button",
        "dijit/form/NumberSpinner"],
        function (on, xhr, registry, Dialog, NumberSpinner) {
            var title1 = "开关量["+ tag +"]";
            var content = "<div style='text-align:center; width:160px; height:50px;'>" +
                            "<button id='yesFormWriteFloatButton' data-dojo-type='dijit/form/Button'>开</button>" +
                            "<button id='noFormWriteFloatButton' data-dojo-type='dijit/form/Button'>关</button>" +
                        "</div>";

            var formWriteFloat = new Dialog({
                id: "formWriteFloat",
                title: title1,
                content: content,
                closable: true,
                onHide: function () {
                    this.destroyRecursive();
                }
            });

            formWriteFloat.startup();

            var yesButton = registry.byId("yesFormWriteFloatButton");
            var noButton = registry.byId("noFormWriteFloatButton");
            //若是点击确定按钮

            on(yesButton, "click", function (mouseEvent) {
                xhr.post("ServerCode/InputHandler.ashx?tag=" + tag + "&value=1", {
                    handleAs: "json",
                    preventCache: true
                }).then(function (data) {
                    if (data.error) {
                        console.log(data.error);
                    }
                }, function (error) {
                    console.log(error);
                    formWriteFloat.hide();
                });
                formWriteFloat.hide();
            });

            //若是点击取消按钮
            on(noButton, "click", function (mouseEvent) {
                xhr.post("ServerCode/InputHandler.ashx?tag=" + tag + "&value=0", {
                    handleAs: "json",
                    preventCache: true
                }).then(function (data) {
                    if (data.error) {
                        console.log(data.error);
                    }
                }, function (error) {
                    console.log(error);
                    formWriteFloat.hide();
                });
                formWriteFloat.hide();
            });

            formWriteFloat.show();
        });
}

/// <summary>
/// 获得提示框图标
/// </summary>
/// <param name="type">信息类型{ok,warning,error,info,question}</param>
/// <remarks>创建人员(日期): ★Ariel★(130810 13:48)</remarks>
function getImg(type) {
    var img;
    
    switch (type) {
        case "ok":
            img = type;
            break;
        case "warning":
            img = type;
            break;
        case "error":
            img = type;
            break;
        case "info":
            img = type;
            break;
        case "question":
            img = type;
            break;
        default:
            img = "info";
            break;
    }

    return img;
}