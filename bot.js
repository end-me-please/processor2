discord=require("discord.js");
config = require("./config.json");


const { command } = require("./util/messageHandler.js");
let messageHandler = require("./util/messageHandler.js");





function pingCmd(handler){
    handler.textReply("Pong!");
}
let ping = new command("ping",pingCmd,["string"],"Ping the bot","beta");
command.load(ping);

//read all files in the commands folder
let fs = require("fs");
let files = fs.readdirSync("./commands");
let fileList = [];
for(let file of files){
    fileList.push(require(`./commands/${file}`));
}
















