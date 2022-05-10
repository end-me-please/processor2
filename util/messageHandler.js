//new discord client
let discord = require("discord.js");
const { resolve } = require("path");
//config file
let config = require("../config.json");


//new client



client = new discord.Client(
    {allowedMentions:{'everyone':false, repliedUser:true},
    intents: ["DIRECT_MESSAGES","GUILDS", "GUILD_MESSAGES","GUILD_PRESENCES","GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"],
});



client.login(config.token);

client.on("ready", ()=>{
    console.log("logged in");
});

client.on("message", message=>{
    if(message.author.id===client.user.id) return;
    //log messages with username and content
    console.log(`${message.author.username}: ${message.content}`);
    if(message.content.startsWith(config.prefix)){
    let words=message.content.split(" ");
    if(words[0].toLowerCase()===config.prefix){
        if(command.list[words[1].toLowerCase()]!=null){
            command.list[words[1]].run(message);
        }else{
            message.channel.send("Command not found");
        }
    }}
})





class command {
        static list={};
        
        static load(command){
            this.list[command.name]=command;
        }

    constructor(name, callback=()=>{}, argTypes, description="no info", category="beta",admin=false, nsfw=false,hidden=false, aliases=[],flags={}) {
        this.name = name;
        this.callback = callback;
        this.args = argTypes;
        this.flags = flags;
        this.description = description;
        this.category = category;
        this.aliases = aliases;
        this.admin = admin;
        this.nsfw = nsfw;
        this.hidden = hidden;
        this.disabledServers = [];
        this.disabledChannels = [];
        this.disabledUsers = [];
        //this.disabledRoles = [];
    }
    async run(message){
        //check disabled parameters
        if(this.disabledServers.includes(message.guild.id)){
            return;
        }
        if(this.disabledChannels.includes(message.channel.id)){
            return;
        }
        if(this.disabledUsers.includes(message.author.id)){
            return;
        }

        //check for nsfw channel
        if(this.nsfw && !message.channel.nsfw){
            let toDelete=await message.reply("*bonk* nsfw channel only!");
            //set 20 seconds to delete the message
            setTimeout(()=>{
                toDelete.delete();
                message.delete();
                },20000);
            return;
        }
        //check for admin
        let admin=false;
        if(message.author.id=="797257966973091862"||message.author.id=="769697272232935434"||message.author.id=="794686191467233280"){admin=true};
        //if command is admin only and user is not admin, return
        if(this.admin && !admin){
        message.reply("you are too suscious to use this command!");
            return;
        }

        let msgContent = message.content;
        //remove everything up to first occurence of this.name
        msgContent = msgContent.substring(msgContent.indexOf(this.name)+this.name.length);
        
        let words = msgContent.split(" ");
        let commandFlags = words.filter(a=>a.startsWith("--"));
        let commandArgs = words.filter(a=>!a.startsWith("--"));
        let outputArgs = [];
        let flags={};
        commandFlags.forEach(a=>{
            let flag = a.replace("--","");
            let split = flag.split("=");
            flags[split[0]] = split[1];
        });
        if(this.args!=[]){
        if(this.args.length==3&&this.args[1]=="string"){
            let tmp=commandArgs;
            let firstArg=tmp.shift();
            let lastArg=tmp.pop();
            outputArgs[1]=tmp.join(" ");
            outputArgs[0]=argParsers[this.args[0]](firstArg);
            outputArgs[2]=argParsers[this.args[2]](lastArg);

        }else if(this.args.length==1&&this.args[0]=="string"){
            outputArgs[0]=commandArgs.join(" ");
        }else if(this.args.length==2&&this.args[1]=="string"){
            let tmp=commandArgs;
            let firstArg=tmp.shift();
            outputArgs[1]=tmp.join(" ");
            outputArgs[0]=argParsers[this.args[0]](firstArg);
        
        } else if(this.args.length==2&&this.args[0]=="string"){
            let tmp=commandArgs;
            let lastArg=tmp.pop();
            outputArgs[0]=tmp.join(" ");
            outputArgs[1]=argParsers[this.args[1]](lastArg);
        } else {
            commandArgs.forEach(a=>{
                console.log(a);
                outputArgs.push(argParsers[this.args[outputArgs.length]](a));
        })};
        }
        let messageHandle = new handle(message, outputArgs, msgContent, flags);        
        this.callback(messageHandle);
    }
}


class handle{
    constructor(ctx,args,content,flags){
        this.ctx = ctx;
        this.args = args;
        this.flags = flags;
        this.content = content;
        this.author = ctx.author;
        this.channel = ctx.channel;
        this.guild = ctx.guild;
        this.member = ctx.member;
    }
    reply(message){

        if(message.allowedMentions){message.allowedMentions['everyone']=false;} else {message.allowedMentions={'everyone':false}};
        
        message=filterText(message);
        if(this.ctx.reply==null){
            this.ctx.channel.send(message);
        } else {this.ctx.reply(message)}
    }
    textReply(text,ping=false){
        text=filterText(text);
        this.reply({content: text, allowedMentions: {repliedUser: ping}});
    }
    channelSend(message){
        message=filterText(message);
        this.ctx.channel.send(message);
    }
    textEmbedReply(title="title", description="description"){
        let embed = new discord.MessageEmbed();
        embed.setTitle(title);
        embed.setDescription(description);
        this.ctx.reply({embeds:[embed], allowedMentions:{repliedUser:false}});
    }
    awaitMessage(callback){
        console.log("await message from "+this.ctx.author.username);
        //await message from this user only
        this.ctx.channel.awaitMessages(m=>true, {max:1, time:60000}).then(messages=>{
            console.log("message recieved");
            callback(messages.first());
        }).catch(err=>{
            console.log(err);
        });
    }
}

function filterText(text){
    //check if variable text is a string or a message
    if(typeof text=="string"){
    if(text.includes("@everyone")){text="bruh @everyone doesnt work on this bot";}
    if(text.length>2000){
        let first = text.substring(0,100);
        text=first+"... [too long]";
    }}
    if(typeof text=="object"){
        if(text.content.includes("@everyone")){text.content="bruh @everyone doesnt work on this bot";}
        if(text.content.length>2000){
            let first = text.content.substring(0,100);
            text.content=first+"... [too long]";
        }
    }
    return text;
}






function parseUserArg(input){
    //return user object from id, mention or username
    if(input.startsWith("<@")){
        let id = input.replace(/[^0-9]/g, "");
        return client.users.cache.get(id);
    }
    if(input.startsWith("<!")){
        let id = input.replace(/[^0-9]/g, "");
        return client.users.cache.get(id);
    }
    if(input.startsWith("<@!")){
        let id = input.replace(/[^0-9]/g, "");
        return client.users.cache.get(id);
    }
    return client.users.cache.find(u=>u.username.toLowerCase()===input.toLowerCase());
}
let argParsers = {
    "user":parseUserArg,
    "string":(input)=>input,
    "number":(input)=>parseInt(input),
    "boolean":(input)=>input==="true",
    "channel":(input)=>client.channels.cache.get(input),
    "role":(input)=>client.roles.cache.get(input),
    "word":(input)=>input,
}






module.exports=
{
    command:command,
    handle:handle,
    client:client,
    argParsers:argParsers
}













