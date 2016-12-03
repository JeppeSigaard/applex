function findXCodeProjectIn(e){var o=shell.ls(e).filter(function(e){return".xcodeproj"===path.extname(e)});if(0===o.length)return Q.reject("No Xcode project found in "+e);o.length>1&&events.emit("warn","Found multiple .xcodeproj directories in \n"+e+"\nUsing first one");var i=path.basename(o[0],".xcodeproj");return Q.resolve(i)}function getXcodeBuildArgs(e,o,i,n,t){var r,c,a,s,l={};return l.otherFlags=[],t&&("string"==typeof t||t instanceof String?parseBuildFlag(t,l):t.forEach(function(e){parseBuildFlag(e,l)})),n?(c=["-xcconfig",l.xcconfig||path.join(__dirname,"..","build-"+i.toLowerCase()+".xcconfig"),"-workspace",l.workspace||e+".xcworkspace","-scheme",l.scheme||e,"-configuration",l.configuration||i,"-destination",l.destination||"generic/platform=iOS","-archivePath",l.archivePath||e+".xcarchive"],a=["archive"],s=[l.configuration_build_dir||"CONFIGURATION_BUILD_DIR="+path.join(o,"build","device"),l.shared_precomps_dir||"SHARED_PRECOMPS_DIR="+path.join(o,"build","sharedpch")],l.sdk&&(l.otherFlags=l.otherFlags.concat(["-sdk",l.sdk]))):(c=["-xcconfig",l.xcconfig||path.join(__dirname,"..","build-"+i.toLowerCase()+".xcconfig"),"-workspace",l.project||e+".xcworkspace","-scheme",l.scheme||e,"-configuration",l.configuration||i,"-sdk",l.sdk||"iphonesimulator","-destination",l.destination||"platform=iOS Simulator,name=iPhone 5s"],a=["build"],s=[l.configuration_build_dir||"CONFIGURATION_BUILD_DIR="+path.join(o,"build","emulator"),l.shared_precomps_dir||"SHARED_PRECOMPS_DIR="+path.join(o,"build","sharedpch")],l.archivePath&&(l.otherFlags=l.otherFlags.concat(["-archivePath",l.archivePath]))),r=c.concat(a).concat(s).concat(l.otherFlags)}function getXcodeArchiveArgs(e,o,i,n){return["-exportArchive","-archivePath",e+".xcarchive","-exportOptionsPlist",n,"-exportPath",i]}function parseBuildFlag(e,o){var i;for(var n in buildFlagMatchers){var t=e.match(buildFlagMatchers[n]);t&&(i=!0,o[n]=t[1],events.emit("warn",util.format("Overriding xcodebuildArg: %s",e)))}i||("-"!==e[0]||e.match(/^.*=(\".*\")|(\'.*\')$/)?(o.otherFlags.push(e),events.emit("warn",util.format("Adding xcodebuildArg: %s",e))):(o.otherFlags=o.otherFlags.concat(e.split(" ")),events.emit("warn",util.format("Adding xcodebuildArg: %s",e.split(" ")))))}var Q=require("q"),path=require("path"),shell=require("shelljs"),spawn=require("./spawn"),fs=require("fs"),plist=require("plist"),util=require("util"),check_reqs;try{check_reqs=require("./check_reqs")}catch(e){check_reqs=require("../../../../lib/check_reqs")}var events=require("cordova-common").events,projectPath=path.join(__dirname,"..",".."),projectName=null,buildFlagMatchers={xcconfig:/^\-xcconfig\s*(.*)$/,workspace:/^\-workspace\s*(.*)/,scheme:/^\-scheme\s*(.*)/,configuration:/^\-configuration\s*(.*)/,sdk:/^\-sdk\s*(.*)/,destination:/^\-destination\s*(.*)/,archivePath:/^\-archivePath\s*(.*)/,configuration_build_dir:/^(CONFIGURATION_BUILD_DIR=.*)/,shared_precomps_dir:/^(SHARED_PRECOMPS_DIR=.*)/};module.exports.run=function(e){if(e=e||{},e.debug&&e.release)return Q.reject('Cannot specify "debug" and "release" options together.');if(e.device&&e.emulator)return Q.reject('Cannot specify "device" and "emulator" options together.');if(e.buildConfig){if(!fs.existsSync(e.buildConfig))return Q.reject("Build config file does not exist:"+e.buildConfig);events.emit("log","Reading build config file:",path.resolve(e.buildConfig));var o=fs.readFileSync(e.buildConfig,"utf-8"),i=JSON.parse(o.replace(/^\ufeff/,""));if(i.ios){var n=e.release?"release":"debug",t=i.ios[n];t&&["codeSignIdentity","codeSignResourceRules","provisioningProfile","developmentTeam","packageType"].forEach(function(o){e[o]=e[o]||t[o]})}}return check_reqs.run().then(function(){return findXCodeProjectIn(projectPath)}).then(function(o){projectName=o;var i="";return e.codeSignIdentity&&(i+="CODE_SIGN_IDENTITY = "+e.codeSignIdentity+"\n",i+="CODE_SIGN_IDENTITY[sdk=iphoneos*] = "+e.codeSignIdentity+"\n"),e.codeSignResourceRules&&(i+="CODE_SIGN_RESOURCE_RULES_PATH = "+e.codeSignResourceRules+"\n"),e.provisioningProfile&&(i+="PROVISIONING_PROFILE = "+e.provisioningProfile+"\n"),e.developmentTeam&&(i+="DEVELOPMENT_TEAM = "+e.developmentTeam+"\n"),Q.nfcall(fs.writeFile,path.join(__dirname,"..","build-extras.xcconfig"),i,"utf-8")}).then(function(){var o=e.release?"Release":"Debug";events.emit("log","Building project: "+path.join(projectPath,projectName+".xcworkspace")),events.emit("log","\tConfiguration: "+o),events.emit("log","\tPlatform: "+(e.device?"device":"emulator"));var i=path.join(projectPath,"build","device");return spawn("rm",["-rf",i],projectPath).then(function(){var i=getXcodeBuildArgs(projectName,projectPath,o,e.device,e.buildFlag);return spawn("xcodebuild",i,projectPath)})}).then(function(){function o(){var e=shell.which("ruby");"/usr/bin/ruby"!=e&&events.emit("warn","Non-system Ruby in use. This may cause packaging to fail.\nIf you use RVM, please run `rvm use system`.\nIf you use chruby, please run `chruby system`.")}function i(){var e=getXcodeArchiveArgs(projectName,projectPath,s,a);return spawn("xcodebuild",e,projectPath)}function n(){var e=path.join(s,projectName+".ipa");return spawn("unzip",["-o","-qq",e],s)}function t(){var e=path.join(s,"Payload",projectName+".app"),o=path.join(s,projectName+".app"),i=path.join(s,"Payload");return spawn("rm",["-rf",o],s).then(function(){return spawn("mv",["-f",e,s],s)}).then(function(){return spawn("rm",["-rf",i],s)})}if(e.device&&!e.noSign){var r={compileBitcode:!1,method:"development"};e.packageType&&(r.method=e.packageType),e.developmentTeam&&(r.teamID=e.developmentTeam);var c=plist.build(r),a=path.join(projectPath,"exportOptions.plist"),s=path.join(projectPath,"build","device");return Q.nfcall(fs.writeFile,a,c,"utf-8").then(o).then(i).then(n).then(t)}})},module.exports.findXCodeProjectIn=findXCodeProjectIn,module.exports.help=function e(){console.log(""),console.log('Usage: build [--debug | --release] [--archs="<list of architectures...>"]'),console.log('             [--device | --simulator] [--codeSignIdentity="<identity>"]'),console.log('             [--codeSignResourceRules="<resourcerules path>"]'),console.log('             [--provisioningProfile="<provisioning profile>"]'),console.log("    --help                  : Displays this dialog."),console.log("    --debug                 : Builds project in debug mode. (Default)"),console.log("    --release               : Builds project in release mode."),console.log("    -r                      : Shortcut :: builds project in release mode."),console.log("    --device, --simulator"),console.log("                            : Specifies, what type of project to build"),console.log("    --codeSignIdentity      : Type of signing identity used for code signing."),console.log("    --codeSignResourceRules : Path to ResourceRules.plist."),console.log("    --provisioningProfile   : UUID of the profile."),console.log("    --device --noSign       : Builds project without application signing."),console.log(""),console.log("examples:"),console.log("    build "),console.log("    build --debug"),console.log("    build --release"),console.log('    build --codeSignIdentity="iPhone Distribution" --provisioningProfile="926c2bd6-8de9-4c2f-8407-1016d2d12954"'),console.log(""),process.exit(0)};