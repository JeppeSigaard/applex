function parseProjectFile(e){var r=e.root,t=e.pbxproj;if(cachedProjectFiles[r])return cachedProjectFiles[r];var i=xcode.project(t);i.parseSync();var o=i.pbxXCBuildConfigurationSection(),n=_.find(o,function(e){return e.buildSettings&&e.buildSettings.INFOPLIST_FILE}),a=path.join(r,n.buildSettings.INFOPLIST_FILE.replace(/^"(.*)"$/g,"$1").replace(/\\&/g,"&")),l=path.join(path.dirname(a),"config.xml");if(!fs.existsSync(a)||!fs.existsSync(l))throw new CordovaError("Could not find *-Info.plist file, or config.xml file.");var s=path.join(r,"frameworks.json"),c={};try{c=require(s)}catch(e){}var u=path.dirname(a),d=path.resolve(u,"Plugins"),p=path.resolve(u,"Resources");return cachedProjectFiles[r]={plugins_dir:d,resources_dir:p,xcode:i,xcode_path:u,pbx:t,projectDir:r,platformWww:path.join(r,"platform_www"),www:path.join(r,"www"),write:function(){return fs.writeFileSync(t,i.writeSync()),0===Object.keys(this.frameworks).length?void shell.rm("-rf",s):void fs.writeFileSync(s,JSON.stringify(this.frameworks,null,4))},getPackageName:function(){return plist.parse(fs.readFileSync(a,"utf8")).CFBundleIdentifier},getInstaller:function(e){return pluginHandlers.getInstaller(e)},getUninstaller:function(e){return pluginHandlers.getUninstaller(e)},frameworks:c},cachedProjectFiles[r]}function purgeProjectFileCache(e){delete cachedProjectFiles[e]}function pbxBuildPhaseObj(e){var r=Object.create(null);return r.value=e.uuid,r.comment=longComment(e),r}function longComment(e){return util.format("%s in %s",e.basename,e.group)}var xcode=require("xcode"),plist=require("plist"),_=require("underscore"),path=require("path"),fs=require("fs"),shell=require("shelljs"),pluginHandlers=require("./plugman/pluginHandlers"),CordovaError=require("cordova-common").CordovaError,cachedProjectFiles={};module.exports={parse:parseProjectFile,purgeProjectFileCache:purgeProjectFileCache},xcode.project.prototype.pbxEmbedFrameworksBuildPhaseObj=function(e){return this.buildPhaseObject("PBXCopyFilesBuildPhase","Embed Frameworks",e)},xcode.project.prototype.addToPbxEmbedFrameworksBuildPhase=function(e){var r=this.pbxEmbedFrameworksBuildPhaseObj(e.target);r&&r.files.push(pbxBuildPhaseObj(e))},xcode.project.prototype.removeFromPbxEmbedFrameworksBuildPhase=function(e){var r=this.pbxEmbedFrameworksBuildPhaseObj(e.target);r&&(r.files=_.reject(r.files,function(e){return e.comment===longComment(e)}))};var util=require("util");