discord=require("discord.js");
config = require("./config.json");
startTime = Date.now();

const { command } = require("./util/messageHandler.js");
let messageHandler = require("./util/messageHandler.js");



//read all files in the commands folder
let fs = require("fs");
let files = fs.readdirSync("./commands");
let fileList = [];
for(let file of files){
    fileList.push(require(`./commands/${file}`));
}
















