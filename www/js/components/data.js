var apiURL = 'http://atletikeksperimentariet.dk/wp-json/wp/v2';


var data = {
    beacons : {},
    posts : {},
    
    fetchPosts : function(endpoint, data, callback){
        $.ajax({
            url : apiURL + endpoint,
            type : 'GET',
            data : data,
            dataType : 'json',
            success : function(response){
                
                if(typeof callback === 'function'){
                    callback(response);
                }
            },
        });
    },
    
    fetchBeacons : function(callback){
        
        data.fetchPosts('/beacon/', '', function(response){
           if(!response.error){
                for(var i = 0; i < response.length; i++){
                    data.beacons[i] = {
                        id : response[i].id,
                        beacon_id : response[i].beacon_id,
                        minor : response[i].minor,
                        major : response[i].major  
                    };
                }
            }

            if(typeof callback === 'function'){
                callback(data.beacons);
            }  
        });
    },
};

