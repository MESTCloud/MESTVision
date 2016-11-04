var ComponentsColorPickers = function() {

    var handleColorPicker = function () {
        if (!jQuery().colorpicker) {
            return;
        }
        $('.colorpicker-default').colorpicker({
            format: 'hex'
        });
        $('.colorpicker-rgba').colorpicker();
    }

    var handleMiniColors = function() {
      /*  $('.demo').each(function() {
            $(this).minicolors({
            	
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function(hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    if (typeof console === 'object') {
                    	console.log($(this))
                        console.log(hex);
                    }
                },
                click:function(hex, opacity){
                	alert(22);
                },
                theme: 'bootstrap'
            });

        });
   */
    }

    return {
        //main function to initiate the module
        init: function() {
            handleMiniColors();
            handleColorPicker();
        }
    };

}();

jQuery(document).ready(function() {    
   ComponentsColorPickers.init(); 
});