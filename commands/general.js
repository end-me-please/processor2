const {command, handle} = require("../util/messageHandler.js");
const units = require("../util/units.js");

function pingCmd(handler){
    handler.textReply("Pong!",true);
}
let ping = new command("ping",pingCmd,["string"],"Ping the bot","general");

function amogusCmd(handler){
    handler.textReply("```--\n    /   )\n    \ _|\n      l  l```");
}
let amogus = new command("amogus",amogusCmd,["string"],"amogus ascii art","general");

function infoCmd(handler){
    let messageTime = handler.ctx.createdTimestamp;
    let responseTime = Date.now()-messageTime;
    //let responseUnit=units.uselessConversion("time",responseTime);
    //let responseTimeString=responseUnit.value+" "+responseUnit.name;
    let responseTimeString=responseTime+"ms";

    let uptime = Date.now()-startTime;
    let uptimeUnit=units.uselessConversion("time",uptime);
    let uptimeString=uptimeUnit.value+" "+uptimeUnit.name;

    let embedString="";
    embedString+="uptime: " + uptimeString + "\n";
    embedString+="prefix: " + config.prefix + "\n";
    embedString+="guilds: " + handler.client.guilds.cache.size + "\n";
    embedString+="response time: " + responseTimeString + "\n";
    embedString+="commands loaded: " + Object.keys(command.list).length + "\n";
    handler.textEmbedReply("info",embedString);
}
let info=new command("info",infoCmd,["string"],"Get info about the bot","general");

command.load(info);
command.load(ping);
command.load(amogus);


