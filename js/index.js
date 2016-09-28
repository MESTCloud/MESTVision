$(".sub-menu > li").click(function () {
    var menu = $('.page-sidebar-menu');

    var el = $(this);

    if (!el || el.size() == 0) {
        return;
    }

    if (el.attr('href') == 'javascript:;' ||
        el.attr('ui-sref') == 'javascript:;' ||
        el.attr('href') == '#' ||
        el.attr('ui-sref') == '#'
        ) {
        return;
    }

    // begin: handle active state
    if (menu.hasClass('page-sidebar-menu-hover-submenu') === false) {
        menu.find('li.nav-item.open').each(function () {
            $(this).removeClass('open');
            $(this).find('> a > .arrow.open').removeClass('open');
            //$(this).find('> .sub-menu').slideUp();
        });
    } else {
        menu.find('li.open').removeClass('open');
    }

    menu.find('li.active').removeClass('active');
    menu.find('li > a > .selected').remove();
    // end: handle active state

    el.parents('li').each(function () {
        $(this).addClass('active');
        $(this).find('> a > span.arrow').addClass('open');
        
        if ($(this).parent('ul.page-sidebar-menu').size() === 1) {
            $(this).find('> a').append('<span class="selected"></span>');
        }

        if ($(this).children('ul.sub-menu').size() === 1) {
            $(this).addClass('open');
        }
    });
    
    if ($(this).find('> a').attr('data-page')) {
        var path = new Array();

        while (true) {
            if (el.parent('ul.page-sidebar-menu').size() === 1) {
                path.push(el.find(' > a > span.title')[0].textContent);
                break;
            } else {
                if (el.find(' > a > span.title')[0]) {
                    path.push(el.find(' > a > span.title')[0].textContent);
                }
            }

            el = el.parent();
        }
        
        var url = $(this).find('> a').attr('data-page');
        if (url.indexOf('?') > -1) {
            url += "&path=" + escape(path.reverse());
        } else {
            url += "?path=" + escape(path.reverse());
        }

        console.log(url);
        $("#ShowPage").attr("src", url);
    }

    var resBreakpointMd = App.getResponsiveBreakpoint('md');
    if (App.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass('in')) { // close the menu on mobile view while laoding a page 
        $('.page-header .responsive-toggler').click();
    }
});