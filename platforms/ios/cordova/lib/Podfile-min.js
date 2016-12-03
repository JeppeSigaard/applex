function Podfile(e,t){this.podToken="##INSERT_POD##",this.path=e,this.projectName=t,this.contents=null,this.pods=null,this.__dirty=!1;var o=this.path.split(path.sep).pop();if(o!==Podfile.FILENAME)throw new CordovaError(util.format("Podfile: The file at %s is not `%s`.",this.path,Podfile.FILENAME));if(!t)throw new CordovaError("Podfile: The projectName was not specified in the constructor.");fs.existsSync(this.path)?(events.emit("verbose","Podfile found in platforms/ios"),this.pods=this.__parseForPods(fs.readFileSync(this.path,"utf8"))):(events.emit("verbose",util.format("Podfile: The file at %s does not exist.",this.path)),events.emit("verbose","Creating new Podfile in platforms/ios"),this.clear(),this.write())}var fs=require("fs"),path=require("path"),util=require("util"),events=require("cordova-common").events,Q=require("q"),superspawn=require("cordova-common").superspawn,CordovaError=require("cordova-common").CordovaError;Podfile.FILENAME="Podfile",Podfile.prototype.__parseForPods=function(e){var t=e.split("\n"),o=new RegExp("pod '(\\w+)'\\s*,?\\s*(.*)");return t.filter(function(e){var t=o.exec(e);return null!==t}).reduce(function(e,t){var i=o.exec(t);if(null!==i){var r=i[2].replace(/^\'|\'$/g,"");e[i[1]]=r}return e},{})},Podfile.prototype.getTemplate=function(){return util.format("# DO NOT MODIFY -- auto-generated by Apache Cordova\nplatform :ios, '8.0'\ntarget '%s' do\n\tproject '%s.xcodeproj'\n%s\nend\n",this.projectName,this.projectName,this.podToken)},Podfile.prototype.addSpec=function(e,t){if(e=e||"",t=t,!e.length)throw new CordovaError("Podfile addSpec: name is not specified.");this.pods[e]=t,this.__dirty=!0,events.emit("verbose",util.format("Added pod line for `%s`",e))},Podfile.prototype.removeSpec=function(e){this.existsSpec(e)&&(delete this.pods[e],this.__dirty=!0),events.emit("verbose",util.format("Removed pod line for `%s`",e))},Podfile.prototype.getSpec=function(e){return this.pods[e]},Podfile.prototype.existsSpec=function(e){return e in this.pods},Podfile.prototype.clear=function(){this.pods={},this.__dirty=!0},Podfile.prototype.destroy=function(){fs.unlinkSync(this.path),events.emit("verbose",util.format("Deleted `%s`",this.path))},Podfile.prototype.write=function(){var e=this.getTemplate(),t=this,o=Object.keys(this.pods).map(function(e){var o=e,i=t.pods[e];return i.length?0===i.indexOf(":")?util.format("\tpod '%s', %s",o,i):util.format("\tpod '%s', '%s'",o,i):util.format("\tpod '%s'",o)}).join("\n");e=e.replace(this.podToken,o),fs.writeFileSync(this.path,e,"utf8"),this.__dirty=!1,events.emit("verbose","Wrote to Podfile.")},Podfile.prototype.isDirty=function(){return this.__dirty},Podfile.prototype.before_install=function(){var e='// DO NOT MODIFY -- auto-generated by Apache Cordova\n#include "Pods/Target Support Files/Pods-%s/Pods-%s.%s.xcconfig"',t=util.format(e,this.projectName,this.projectName,"debug"),o=util.format(e,this.projectName,this.projectName,"release"),i=path.join(this.path,"..","pods-debug.xcconfig"),r=path.join(this.path,"..","pods-release.xcconfig");return fs.writeFileSync(i,t,"utf8"),fs.writeFileSync(r,o,"utf8"),Q.resolve()},Podfile.prototype.install=function(e){var t={};t.cwd=path.join(this.path,".."),t.stdio="pipe";var o=!0,i=this;return e||(e=Q()),e().then(function(){return i.before_install()}).then(function(){return superspawn.spawn("pod",["install","--verbose"],t).progress(function(e){e.stderr&&console.error(e.stderr),e.stdout&&(o&&(events.emit("verbose","==== pod install start ====\n"),o=!1),events.emit("verbose",e.stdout))})}).then(function(){events.emit("verbose","==== pod install end ====\n")}).fail(function(e){throw e})},module.exports.Podfile=Podfile;