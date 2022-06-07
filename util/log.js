const discord = require("discord.js");
const { command, client, addMessageListener } = require("./messageHandler");
const {user, userdata} = require("./storage.js");
const Sentiment = require("sentiment");
let sentiment = new Sentiment();

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
botChannels.commandLog = "983511133673644072";
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
    logCommand(handler) 
    {
        let embed = new discord.MessageEmbed()
            .setTitle(handler.ctx.author.username + " used command " + handler.ctx.content.split(" ")[1])
            .setColor("#0099ff")
            .setDescription(handler.ctx.content)
            .setTimestamp();

            this.currentBuffer.push(embed);
        if (this.currentBuffer.length > this.maxSize) {
            this.send();
        }
    }
    send() {
        this.client.channels.cache.get(this.channel).send({content:"h", embeds:this.currentBuffer});
        this.currentBuffer = [];
        }
    }


errorLog = new eventLog(client, botChannels.error);
mediaLog = new eventLog(client, botChannels.media);
editLog = new eventLog(client, botChannels.edit);
generalLog = new eventLog(client, botChannels.general);
messageSourceLog = new eventLog(client, botChannels.messageSource);
commandLog = new embedEventLog(client, botChannels.commandLog);


let logflushFunc = function (handler) {
    errorLog.send();
    mediaLog.send();
    editLog.send();
    generalLog.send();
    messageSourceLog.send();
    commandLog.send();
    handler.textReply("*flushing noises*");
}

let logflushCmd = new command("logflush", logflushFunc, ["string"], "flush error logs", "admin", true, false, true);
command.load(logflushCmd);

module.exports = {
    errorLog: errorLog,
    mediaLog: mediaLog,
    editLog: editLog,
    generalLog: generalLog,
    messageSourceLog: messageSourceLog,
    commandLog: commandLog,
    eventLog: eventLog,
    embedEventLog: embedEventLog
}


function logMessage(message) {
    let sentimentScore = sentiment.analyze(message.content);
    let currentUser = userdata.get(message.author.id);

    //let data = currentUser.getData();
    let data = currentUser.data;
    if(data.sentiment==null){
        data.sentiment = {score:0,messages:0};
        errorLog.logError("User " + message.author.tag + " had no sentiment data");
    }
    data.sentiment.score += sentimentScore.score;
    data.sentiment.messages++;
    currentUser.setData(data);
    
    
    //log plain text with timestamp, channel, and author
    let log = "[" + message.createdAt.toLocaleString() + "] " + message.channel.name + ": " + message.author.tag + ": " + message.content;
    messageSourceLog.logInfo(log);






}
addMessageListener(logMessage);

//on uncaught exception
process.on('uncaughtException', function (err) {
    console.log(err);
    //check if the error is a rate limit error
    errorLog.logError("```"+err+"```");
}
);








