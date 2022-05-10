const {command, handle} = require("../util/messageHandler.js");

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
    





}


command.load(ping);
command.load(amogus);


