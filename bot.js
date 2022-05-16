discord=require("discord.js");
config = require("./config.json");
startTime = Date.now();
const { spawn } = require('child_process');

const { command, client } = require("./util/messageHandler.js");
let messageHandler = require("./util/messageHandler.js");



//read all files in the commands folder
let fs = require("fs");
let files = fs.readdirSync("./commands");
fileList = [];
for(let file of files){
    fileList.push(require(`./commands/${file}`));
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
          //client.destroy();
        }
    );
}

let updateCmd = new command("update", updateCmdFunc, ["string"], "admin", true);
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










