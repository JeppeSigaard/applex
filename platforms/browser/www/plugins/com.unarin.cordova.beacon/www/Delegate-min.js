cordova.define("com.unarin.cordova.beacon.Delegate",function(o,n,i){function e(){}var r=o("com.unarin.cordova.beacon.underscorejs"),t=o("com.unarin.cordova.beacon.Regions");e.didDetermineStateForRegion=function(o){o.region=t.fromJson(o.region)},e.monitoringDidFailForRegionWithError=function(o){o.region=t.fromJson(o.region)},e.didStartMonitoringForRegion=function(o){o.region=t.fromJson(o.region)},e.didExitRegion=function(o){o.region=t.fromJson(o.region)},e.didEnterRegion=function(o){o.region=t.fromJson(o.region)},e.didRangeBeaconsInRegion=function(o){o.region=t.fromJson(o.region)},e.peripheralManagerDidStartAdvertising=function(o){o.region=t.fromJson(o.region)},e.peripheralManagerDidUpdateState=function(o){},e.didChangeAuthorizationStatus=function(o){},e.safeTraceLogging=function(o){if(r.isString(o))try{cordova.plugins.locationManager.appendToDeviceLog(o)}catch(o){console.error("Fail in safeTraceLogging()"+o.message,o)}},e.prototype.didDetermineStateForRegion=function(){e.safeTraceLogging("DEFAULT didDetermineStateForRegion()")},e.prototype.monitoringDidFailForRegionWithError=function(){e.safeTraceLogging("DEFAULT monitoringDidFailForRegionWithError()")},e.prototype.didStartMonitoringForRegion=function(){e.safeTraceLogging("DEFAULT didStartMonitoringForRegion()")},e.prototype.didExitRegion=function(){e.safeTraceLogging("DEFAULT didExitRegion()")},e.prototype.didEnterRegion=function(){e.safeTraceLogging("DEFAULT didEnterRegion()")},e.prototype.didRangeBeaconsInRegion=function(){e.safeTraceLogging("DEFAULT didRangeBeaconsInRegion()")},e.prototype.peripheralManagerDidStartAdvertising=function(){e.safeTraceLogging("DEFAULT peripheralManagerDidStartAdvertising()")},e.prototype.peripheralManagerDidUpdateState=function(){e.safeTraceLogging("DEFAULT peripheralManagerDidUpdateState()")},e.prototype.didChangeAuthorizationStatus=function(){e.safeTraceLogging("DEFAULT didChangeAuthorizationStatus()")},i.exports=e});