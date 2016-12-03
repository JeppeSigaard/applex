function filterSupportedArgs(e){var o=[],t=["--device","--emulator","--nobuild","--list","--target","--debug","--release"],n=new RegExp(t.join("|"));return e.forEach(function(e){e.search(n)==-1&&o.push(e)},this),o}function checkDeviceConnected(){return spawn("ios-deploy",["-c","-t","1"])}function deployToDevice(e,o,t){return o?spawn("ios-deploy",["--justlaunch","-d","-b",e,"-i",o].concat(t)):spawn("ios-deploy",["--justlaunch","--no-wifi","-d","-b",e].concat(t))}function deployToSim(e,o){return o?startSim(e,o):require("./list-emulator-images").run().then(function(t){return t.length>0&&(o=t[0]),t.forEach(function(e){0===e.indexOf("iPhone")&&(o=e)}),events.emit("log","No target specified for emulator. Deploying to "+o+" simulator"),startSim(e,o)})}function startSim(e,o){var t=path.join(cordovaPath,"console.log");return iossim.launch(e,"com.apple.CoreSimulator.SimDeviceType."+o,t,"--exit")}function listDevices(){return require("./list-devices").run().then(function(e){events.emit("log","Available iOS Devices:"),e.forEach(function(e){events.emit("log","\t"+e)})})}function listEmulators(){return require("./list-emulator-images").run().then(function(e){events.emit("log","Available iOS Simulators:"),e.forEach(function(e){events.emit("log","\t"+e)})})}var Q=require("q"),path=require("path"),iossim=require("ios-sim"),build=require("./build"),spawn=require("./spawn"),check_reqs=require("./check_reqs"),events=require("cordova-common").events,cordovaPath=path.join(__dirname,".."),projectPath=path.join(__dirname,"..","..");module.exports.run=function(e){if(e.device&&e.emulator)return Q.reject('Only one of "device"/"emulator" options should be specified');if(e.list)return e.device?listDevices():e.emulator?listEmulators():listDevices().then(function(){return listEmulators()});var o=!!e.device;return require("./list-devices").run().then(function(t){if(t.length>0&&!e.emulator)return o=!0,e.device=!0,check_reqs.check_ios_deploy()}).then(function(){return e.nobuild?Q.resolve():build.run(e)}).then(function(){return build.findXCodeProjectIn(projectPath)}).then(function(t){var n=path.join(projectPath,"build","emulator",t+".app");return o?checkDeviceConnected().then(function(){n=path.join(projectPath,"build","device",t+".app");var o=[];return e.argv&&(o=filterSupportedArgs(e.argv.slice(2))),deployToDevice(n,e.target,o)},function(){return deployToSim(n,e.target)}):deployToSim(n,e.target)})},module.exports.help=function(){console.log("\nUsage: run [ --device | [ --emulator [ --target=<id> ] ] ] [ --debug | --release | --nobuild ]"),console.log("    --device      : Deploys and runs the project on the connected device."),console.log("    --emulator    : Deploys and runs the project on an emulator."),console.log("    --target=<id> : Deploys and runs the project on the specified target."),console.log("    --debug       : Builds project in debug mode. (Passed down to build command, if necessary)"),console.log("    --release     : Builds project in release mode. (Passed down to build command, if necessary)"),console.log("    --nobuild     : Uses pre-built package, or errors if project is not built."),console.log(""),console.log("Examples:"),console.log("    run"),console.log("    run --device"),console.log('    run --emulator --target="iPhone-6-Plus"'),console.log("    run --device --release"),console.log("    run --emulator --debug"),console.log(""),process.exit(0)};