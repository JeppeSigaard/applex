$(document).on('click','.header-btn',function(){
    var btn = $(this);

    // Åben menu
    if(btn.hasClass('menu')){
        btn.removeClass('menu').addClass('menu-close');
        app.goTo(90,{ animation: 'bottom', timing: 300 });
    }
    
    // Luk menu
    else if(btn.hasClass('menu-close')){
        app.goTo(prevPage, { animation: 'top', timing: 300});
        btn.removeClass('menu-close').addClass('menu');
    }
    
    // Tilbage
    else if(btn.hasClass('back')){
        var current = app.getActiveScreen(),
            parent = $('.screen[data-screen="'+current+'"').attr('data-parent');
        
        app.goTo(parent, { animation: 'right', timing: 300});
        
        if(10 == parent){
            btn.removeClass('back').addClass('menu');
        }
    }
});