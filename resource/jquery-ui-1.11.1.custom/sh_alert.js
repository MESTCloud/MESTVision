
(function () {
    var _shconfirm = {};
    var _shprompt = {};
    //闭包初始化；
    $(function () {
        $("#dialogalert").dialog({
            modal: true,
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 500
            },
            hide: {
                effect: "explode",
                duration: 500
            },
            buttons: {
                确定: function () {
                    $(this).dialog("close");
                }
            }
        });
        $("#dialogconfirm").dialog({
            modal: true,
            autoOpen: false,
            show: {
                effect: "slide",
                duration: 500
            },
            hide: {
                effect: "drop",
                duration: 500
            },
            buttons: {
                确定: function () {
                    _shconfirm.shconfirmCallBack(true);
                    $(this).dialog("close");
                },

                取消: function () {
                    _shconfirm.shconfirmCallBack(false);
                    $(this).dialog("close");

                }
            }
        });
        $("#dialogprompt").dialog({
            modal: true,
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 500
            },
            hide: {
                effect: "puff",
                duration: 500
            },
            buttons: {
                确定: function () {
                    if (_shprompt.shpromptObj.regex) {
                        if (!_shprompt.shpromptObj.regex.test($("#dialogprompt .text").val())) {
                            $("#dialogprompt .alert .promptmsg").html(_shprompt.shpromptObj.regexmsg);
                            $("#dialogprompt .alert").slideDown();
                            return;
                        } else {
                            $("#dialogprompt .alert").hide();
                        }
                    }
                    _shprompt.shpromptObj.callback($("#dialogprompt .text").val());
                    $(this).dialog("close");
                },

                取消: function () {
                    _shprompt.shpromptObj.callback($("#dialogprompt .text").val());
                    $(this).dialog("close");

                }
            }
        });
    });

    window.shalert = function (message) {
        $("#dialogalert .msgcontent").html(message);
        $("#dialogalert").dialog("open");
    };
    //message 提示的信息 ,callback(true/false)回调函数
    window.shconfirm = function (message, callback) {
        $("#dialogconfirm .msgcontent").html(message);
        $("#dialogconfirm").dialog("open");
        _shconfirm.shconfirmCallBack = callback;
    };
    //message 提示的信息 ,callback(msg)回调函数（用户输入的消息）, param：regex 输入的 正则验证，regexmsg 正则验证不通过的提示
    window.shprompt = function (message, callback, regex, regexmsg) {
        $("#dialogprompt .msgcontent").html(message);
        $("#dialogprompt").dialog("open");
        _shprompt.shpromptObj = {
            callback: callback,
            regex: regex,
            regexmsg: regexmsg
        };
    }
})();

