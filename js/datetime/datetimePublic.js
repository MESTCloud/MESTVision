/*
        $('#config-text').keyup(function() {
          eval($(this).val());
        });
        
        $('.configurator input, .configurator select').change(function() {
          updateConfig();
        });

        $('.demo i').click(function() {
          $(this).parent().find('input').click();
        });

        $('#startDate').daterangepicker({
        	
          singleDatePicker: true,
          startDate: moment().subtract(29, 'days')
          
        });

        $('#endDate').daterangepicker({
          singleDatePicker: true,
          startDate: moment()
        });

        updateConfig();

        function updateConfig() {
          var options = {};
          options.timePicker = true;
          options.timePicker24Hour = true;
          options.timePickerSeconds = true;
          //options.startDate =moment().subtract('days', 29);
          //options.endDate = moment();
            //  options.dateLimit = { days: 7 };
                $('#rtl-wrap').show();
            options.locale = {
              direction: $('#rtl').is(':checked') ? 'rtl' : 'ltr',
              format: 'YYYY/MM/DD HH:mm:ss',
              separator: ' - ',
              applyLabel: '确定',
              cancelLabel: '取消',
              fromLabel: 'From',
                
              toLabel: 'To',
              customRangeLabel: 'Custom',
              daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
                                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  
                                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
              firstDay: 1
            };
           
       
          $('#config-demo').daterangepicker(options, function(start, end, label) 
          { 
         
          	console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')'); 
          });
        
        }
*/


/* $(document).ready(function (){  */
                    //时间插件  
                    //$('#reportrange span').html(moment().subtract('hours', 1).format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));  
          
                    $('#reportrange').daterangepicker(  
                            {  
                                // startDate: moment().startOf('day'),  
                                //endDate: moment(),  
                                //minDate: '01/01/2012',    //最小时间  
                                maxDate : moment(), //最大时间   
                               /* dateLimit : {  
                                    days : 30  
                                }, *///起止时间的最大间隔  
                                showDropdowns : true,  
                                showWeekNumbers : false, //是否显示第几周  
                                timePicker : true, //是否显示小时和分钟  
                                timePickerIncrement : 60, //时间的增量，单位为分钟  
                                timePicker12Hour : false, //是否使用12小时制来显示时间  
                                /*ranges : {  
                                    //'最近1小时': [moment().subtract('hours',1), moment()],  
                                    '今日': [moment().startOf('day'), moment()],  
                                    '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],  
                                    '最近7日': [moment().subtract('days', 6), moment()],  
                                    '最近30日': [moment().subtract('days', 29), moment()]  
                                }, */ 
                                opens : 'right', //日期选择框的弹出位置  
                                buttonClasses : [ 'btn btn-default' ],  
                                applyClass : 'btn-small btn-primary blue',  
                                cancelClass : 'btn-small',  
                                format : 'YYYY/MM/DD HH:mm:ss', //控件中from和to 显示的日期格式  
                                separator : ' to ',  
                                locale : {  
                                    applyLabel : '确定',  
                                    cancelLabel : '取消',  
                                    fromLabel : '起始时间',  
                                    toLabel : '结束时间',  
                                    customRangeLabel : '自定义',  
                                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
                                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  
                                            '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
                                    firstDay : 1  
                                }  
                            }, function(start, end, label) {//格式化日期显示框
                            	console.log($("#searchDateRange"));
                                 $("#config-demo").val(start.format('YYYY/MM/DD HH:mm:ss') + ' - ' + end.format('YYYY/MM/DD HH:mm:ss')) 
                                //$('#reportrange input').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));  
                           });   
/*        }) */ 