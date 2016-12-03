#!/usr/bin/env node
var path=require("path"),fs=require("fs"),shjs=require("shelljs"),zip=require("adm-zip"),Q=require("q"),clean=require("./clean"),check_reqs=require("./check_reqs"),platformWwwDir=path.join("platforms","browser","www"),platformBuildDir=path.join("platforms","browser","build"),packageFile=path.join(platformBuildDir,"package.zip");module.exports.run=function(){return check_reqs.run().then(function(){return clean.cleanProject()},function e(r){console.error("Please make sure you meet the software requirements in order to build a browser cordova project")}).then(function(){fs.existsSync(platformBuildDir)||fs.mkdirSync(platformBuildDir);var e=zip();return e.addLocalFolder(platformWwwDir,"."),e.writeZip(packageFile),Q.resolve()})},module.exports.help=function(){console.log("Usage: cordova build browser"),console.log("Build will create the packaged app in '"+platformBuildDir+"'.")};