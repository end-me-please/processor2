discord=require("discord.js");
config = require("./config.json");
startTime = Date.now();
const { spawn } = require('child_process');

const { command, client } = require("./util/messageHandler.js");
let messageHandler = require("./util/messageHandler.js");
botStats = require("./util/stats.js");

startupLog = "initializing...";
//read all files in the commands folder
let fs = require("fs");
let cmdfiles = fs.readdirSync("./commands");
let utilfiles = fs.readdirSync("./util");
fileList = [];

util={};
for(let file of cmdfiles){
    try {
    fileList.push(require(`./commands/${file}`));
    console.log(`loaded ${file}`);
    } catch (e) {
        startupLog += `\n\n${file} command file failed to load: ` +"```"+ e +"```";
        console.log(`error loading ${file}`);
    }
}
for(let file of utilfiles){
    try {
    util[file.split(".")[0]] = require(`./util/${file}`);
    console.log(`loaded ${file}`);
    } catch (e) {
        startupLog += `\n\n${file} util file failed to load: ` +"```"+ e +"```";
        console.log(`error loading ${file}`);
    }
}




if(startupLog=="initializing..."){

    let fakeActions = ["leaking memory..", "catching escaped errors..", "allocating garbage..", "calculating pi..", "spamming logs..", "making tea..", "eating sandwich..", "formatting C: drive..", "doing nothing..", "implementing new bugs.."];

    let messageCount = Math.floor(Math.random()*4);
    for (let i=0;i<messageCount;i++){
    if(Math.random()<0.5){
        startupLog += `\n${fakeActions[Math.floor(Math.random()*fakeActions.length)]}`;
    }}
}






//command that runs script "update.sh", admin only
function updateCmdFunc(handler){
    //run "git pull"
    let exec = require("child_process").exec;
    exec("git pull", (err, stdout, stderr)=>{
        if(err){
            console.log(err);
            return;
        }
        spawn(process.argv[0], process.argv.slice(1), {
            env: { process_restarting: 1 },
            stdio: 'ignore',
          }).unref();
          setTimeout(()=>{process.exit()}, 2000);
          handler.textReply("goodbye, cruel world\n*departure*");
          shut=true;
        }
    );
}
function shutdownCmdFunc(handler){
    handler.textReply("goodbye, cruel world\n*departure*");
    setTimeout(()=>{client.destroy();process.exit()}, 100);
}
let shutdownCmd = new command("shutdown", shutdownCmdFunc, ["string"], "shut the bot down", "admin", true);
let updateCmd = new command("update", updateCmdFunc, ["string"], "pull latest changes from github", "admin" , true);
command.load(shutdownCmd);
command.load(updateCmd);


//on uncaught exception
process.on('uncaughtException', function (err) {
    console.log(err);
    //check if the error is a rate limit error
    client.channels.cache.get("951090975554568193").send("```"+err+"```");
    let startTime = Date.now();
    while(Date.now()-startTime<500){
    }
}
);










