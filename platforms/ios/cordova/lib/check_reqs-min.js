function check_cocoapod_tool(){return checkTool("pod",COCOAPODS_MIN_VERSION,COCOAPODS_NOT_FOUND_MESSAGE,"CocoaPods")}function checkTool(e,o,r,t){t=t||e;var s=shell.which(e);return s?versions.get_tool_version(e).then(function(e){return e=e.trim(),versions.compareVersions(e,o)>=0?Q.resolve(e):Q.reject("Cordova needs "+t+" version "+o+" or greater, you have version "+e+". "+(r||""))}):Q.reject(t+" was not found. "+(r||""))}var Q=require("q"),shell=require("shelljs"),util=require("util"),versions=require("./versions"),XCODEBUILD_MIN_VERSION="7.0.0",XCODEBUILD_NOT_FOUND_MESSAGE="Please install version "+XCODEBUILD_MIN_VERSION+" or greater from App Store",IOS_DEPLOY_MIN_VERSION="1.9.0",IOS_DEPLOY_NOT_FOUND_MESSAGE="Please download, build and install version "+IOS_DEPLOY_MIN_VERSION+" or greater from https://github.com/phonegap/ios-deploy into your path, or do 'npm install -g ios-deploy'",COCOAPODS_MIN_VERSION="1.0.1",COCOAPODS_NOT_FOUND_MESSAGE="Please install version "+COCOAPODS_MIN_VERSION+" or greater from https://cocoapods.org/",COCOAPODS_NOT_SYNCED_MESSAGE="The CocoaPods repo has not been synced yet, this will take a long time (approximately 500MB as of Sept 2016). Please run `pod setup` first to sync the repo.",COCOAPODS_SYNCED_MIN_SIZE=475,COCOAPODS_SYNC_ERROR_MESSAGE="The CocoaPods repo has been created, but there appears to be a sync error. The repo size should be at least "+COCOAPODS_SYNCED_MIN_SIZE+". Please run `pod setup --verbose` to sync the repo.",COCOAPODS_REPO_NOT_FOUND_MESSAGE="The CocoaPods repo at ~/.cocoapods was not found.";module.exports.run=module.exports.check_xcodebuild=function(){return checkTool("xcodebuild",XCODEBUILD_MIN_VERSION,XCODEBUILD_NOT_FOUND_MESSAGE)},module.exports.check_ios_deploy=function(){return checkTool("ios-deploy",IOS_DEPLOY_MIN_VERSION,IOS_DEPLOY_NOT_FOUND_MESSAGE)},module.exports.check_os=function(){return"darwin"===process.platform?Q.resolve(process.platform):Q.reject("Cordova tooling for iOS requires Apple OS X")},module.exports.check_cocoapods_repo_size=function(){return check_cocoapod_tool().then(function(){var e=util.format("du -sh %s/.cocoapods",process.env.HOME),o=shell.exec(e,{silent:!0});return 0!==o.code?Q.reject(util.format("%s (%s)",COCOAPODS_REPO_NOT_FOUND_MESSAGE,o.output)):Q.resolve(parseFloat(o.output))}).then(function(e){return COCOAPODS_SYNCED_MIN_SIZE>e?Q.reject(COCOAPODS_SYNC_ERROR_MESSAGE):Q.resolve()})},module.exports.check_cocoapods=function(){return check_cocoapod_tool().then(function(){var e=shell.exec('pod repo | grep -e "^0 repos"',{silent:!0}).code;return Q.resolve(0!==e)}).then(function(e){return e?Q.resolve():Q.reject(COCOAPODS_NOT_SYNCED_MESSAGE)})};var Requirement=function(e,o,r){this.id=e,this.name=o,this.installed=!1,this.metadata={},this.isFatal=r||!1};module.exports.check_all=function(){var e=[new Requirement("os","Apple OS X",!0),new Requirement("xcode","Xcode"),new Requirement("ios-deploy","ios-deploy"),new Requirement("CocoaPods","CocoaPods")],o=[],r=!1,t=[module.exports.check_os,module.exports.check_xcodebuild,module.exports.check_ios_deploy,module.exports.check_cocoapods];return t.reduce(function(t,s,n){return t.then(function(){if(r)return Q();var t=e[n];return s().then(function(e){t.installed=!0,t.metadata.version=e,o.push(t)},function(e){t.isFatal&&(r=!0),t.metadata.reason=e,o.push(t)})})},Q()).then(function(){return o})};