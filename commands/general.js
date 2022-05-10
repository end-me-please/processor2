const {command, handle} = require("../util/messageHandler.js");

function pingCmd(handler){
    handler.textReply("Pong!",true);
}
let ping = new command("ping",pingCmd,[],"Ping the bot","general");

function amogusCmd(handler){
    handler.textReply("--\n    /   )\n    \ _|\n      l  l");
}
function infoCmd(handler){
    let messageTime = handler.ctx.createdTimestamp;
    let responseTime = Date.now()-messageTime;
    





}







let amogus = new command("amogus",amogusCmd,[],"amogus ascii art","general");
command.load(ping);


