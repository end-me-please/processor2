const discord = require("discord.js");
const { command } = require("./messageHandler");

let botChannels = {};
//decode base64 unicode
function decode(str){
    return Buffer.from(str, 'base64').toString('ascii');
}

botChannels.error = "983510621314232330";
botChannels.media = "983510809000951808";
botChannels.edit = "983521166360735805";
botChannels.general = "983531040549273631";
botChannels.messageSource = "983531320212860989";
botChannels.startupChannel = "935956434259177483";


class eventLog {
    constructor(client, channel) {
        this.client = client;
        this.channel = channel;
        this.currentBuffer = "";
        this.maxSize = 1200;
    }
    logInfo(text) {
        this.currentBuffer += "[i]" + text + "\n\n";
        if (this.currentBuffer.length > this.maxSize) {
            this.send();
        }
    }
    logError(text) {
        this.currentBuffer += "[e]" + text + "\n\n";
        if (this.currentBuffer.length > this.maxSize) {
            this.send();
        }
    }
    logWarning(text) {
        this.currentBuffer += "[w]" + text + "\n\n";
        if (this.currentBuffer.length > this.maxSize) {
            this.send();
        }
    }
    send() {
        //check if longer than 1999 characters
        if (this.currentBuffer.length < 1999) {
            if(this.currentBuffer.length>0){
        this.client.channels.cache.get(this.channel).send(this.currentBuffer);
            }
        } else {
            //remove last 50 characters and add warning
            this.currentBuffer = this.currentBuffer.substring(0, this.currentBuffer.length - 90);
            this.currentBuffer += "[w]Logger buffer exceeded max size, sending partial log.\n\n";
            this.client.channels.cache.get(this.channel).send(this.currentBuffer);
        }
        this.currentBuffer = "";
    }
}


class embedEventLog {
    constructor(client, channel) {
        this.client = client;
        this.channel = channel;
        this.currentBuffer = [];
        this.maxSize = 9;
    }
    logCommand(user,command,response,channel,errors="none") {
        let embed = new discord.MessageEmbed()
            .setTitle("Command")
            .setColor("#0099ff")
            .setDescription(`${user} used command ${command} in ${channel}`)
            .addField("Response", response)
            .setTimestamp();
        this.currentBuffer.push(embed);
        if (this.currentBuffer.length > this.maxSize) {
            this.send();
        }
    }
    send() {
        this.client.channels.cache.get(this.channel).send(this.currentBuffer);
        this.currentBuffer = [];
        }
    }


let errorLog = new eventLog(client, botChannels.error);
let mediaLog = new eventLog(client, botChannels.media);
let editLog = new eventLog(client, botChannels.edit);
let generalLog = new eventLog(client, botChannels.general);
let messageSourceLog = new eventLog(client, botChannels.messageSource);


//overwrite console.error
console.error = function (text) {
    errorLog.logError(text);
}
//overwrite console.warn
console.warn = function (text) {
    errorLog.logWarning(text);
}


let logflushFunc = function () {
    errorLog.send();
    mediaLog.send();
    editLog.send();
    generalLog.send();
    messageSourceLog.send();
}
let logflushCmd = new command("logflush", logflushFunc, [], "flush error logs", "admin", true, false, true);
command.load(logflushCmd);