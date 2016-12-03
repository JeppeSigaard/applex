var app = {
    // Application Constructor
    initialize: function() { document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);},

    fakeInit: function(){
        setTimeout(function(){
            app.onDeviceReady();
        },100);
    },
    
    onDeviceReady: function() {
       data.fetchBeacons(function(){
           app.goTo(10);              
        });
    },
    getActiveScreen: function(){
        return $('.app-screens').attr('data-screen');
    },
};

app.initialize();

/// For browser testing, nmvd lol >:-)
app.fakeInit();
var prevPage = app.getActiveScreen();