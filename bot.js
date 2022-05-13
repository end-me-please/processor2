discord=require("discord.js");
config = require("./config.json");
startTime = Date.now();
const { spawn } = require('child_process');

const { command } = require("./util/messageHandler.js");
let messageHandler = require("./util/messageHandler.js");



//read all files in the commands folder
let fs = require("fs");
let files = fs.readdirSync("./commands");
let fileList = [];
for(let file of files){
    fileList.push(require(`./commands/${file}`));
}

//command that runs script "update.sh", admin only
function updateCmdFunc(handler){
    //run "git pull"
    let exec = require("child_process").exec;
    exec("git pull", (err, stdout, stderr)=>{
        if(err){
            //handler.textReply("Error: "+err);
            return;
        }
        handler.textReply("Updated!");
        //restart process

        spawn(process.argv[0], process.argv.slice(1), {
            env: { process_restarting: 1 },
            stdio: 'ignore',
          }).unref();
          
          setTimeout(process.exit, 6000);
    }
    );
}

let updateCmd = new command("update", updateCmdFunc, ["string"], "admin", true);
command.load(updateCmd);














