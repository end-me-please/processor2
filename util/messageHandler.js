//new discord client
let discord = require("discord.js");
const { resolve } = require("path");
//config file
let config = require("../config.json");
shut=false;

//new client



client = new discord.Client(
    {allowedMentions:{'everyone':false, repliedUser:true},
    intents: ["DIRECT_MESSAGES","GUILDS", "GUILD_MESSAGES","GUILD_PRESENCES","GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"],
});



client.login(config.token);

client.on("ready", ()=>{
    console.log("logged in");
    client.channels.cache.get("935956434259177483").send(""+startupLog+"\n\narrival");

    client.user.setActivity('YOU', { type: 'WATCHING' })
});

messageProcessors = [];
addMessageListener = (func)=>{
    messageProcessors.push(func);
}


client.on("message", message=>{
    if(shut){return;}
    if(message.author.id===client.user.id) return;
    //log messages with username and content
    if(!message.author.bot){
    console.log(`${message.author.username}: ${message.content}`);
    messageProcessors.forEach(m=>{
        try{
            m(message);
        } catch(e){
            console.log(e);
        }
    });}

    if(message.content.startsWith(config.prefix)){
    let words=message.content.split(" ");
    words=words.map(w=>w+"");
    if(words[0].toLowerCase()===config.prefix){
        if(command.list[words[1].toLowerCase()]!=null){
            try {
                command.list[words[1]].run(message);
            } catch (e) {
                console.log(e);
                //check if instance of commandError
                if(e instanceof commandError){
                    message.reply({allowedMentions: {repliedUser: ping, everyone: false},content: "something went wrong: \n´´´"+e + "´´´"});
                }
            }
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
        this.inlineCapable=false;

        if(argTypes==null||argTypes==[]){
            argTypes=["string"];
        } else {
            this.args = argTypes;
        }
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
    }
    setOptions(options){
        //just set all properties from keys
        for(let key in options){
            this[key]=options[key];
        }
        return this;
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
        msgContent = msgContent.substring(msgContent.indexOf(this.name)+this.name.length).trim();
        let words = msgContent.split(" ");
        let commandFlags = words.filter(a=>a.startsWith("--"));
        let commandArgs = words.filter(a=>!a.startsWith("--"));
        console.log(commandArgs);
        let outputArgs = [];
        let flags={};
        commandFlags.forEach(a=>{
            let flag = a.replace("--","");
            let split = flag.split("=");
            if(split[1]==null){split[1]=true;};
            flags[split[0]] = split[1];
        });
        if(this.args!=[]){
        if(this.args.length==3&&this.args[1]=="string"){
            let tmp=commandArgs;
            let firstArg=tmp.shift();
            let lastArg=tmp.pop();
            outputArgs[1]=tmp.join(" ");
            outputArgs[0]=parseArg(this.args[0],firstArg);
            outputArgs[2]=parseArg(this.args[2],lastArg);

        }else if(this.args.length==1&&this.args[0]=="string"){
            outputArgs[0]=commandArgs.join(" ");

        }else if(this.args.length==2&&this.args[1]=="string"){
            let tmp=commandArgs;
            let firstArg=tmp.shift();
            outputArgs[1]=tmp.join(" ");
            outputArgs[0]=parseArg(this.args[0],firstArg);
        
        } else if(this.args.length==2&&this.args[0]=="string"){
            let tmp=commandArgs;
            let lastArg=tmp.pop();
            outputArgs[0]=tmp.join(" ");
            outputArgs[1]=parseArg(this.args[1],lastArg);

        } else {
            try{
            commandArgs.forEach(a=>{
                console.log("command arg:"+a);
                outputArgs.push(parseArg(this.args[outputArgs.length],a));
        })
        }catch(e){console.log(e);message.reply("invalid args!" + "\n ```" + this.args + "```");return;}
        };
        } else { outputArgs=[]; }
        let messageHandle = new handle(message, outputArgs, msgContent, flags, admin);        
        this.callback(messageHandle);
    }
}


class handle{
    constructor(ctx,args,content,flags,isAdmin,isInline=false, inlineCallback=()=>{}){
        this.ctx = ctx;
        this.args = args;
        this.flags = flags;
        this.content = content;
        this.author = ctx.author;
        this.channel = ctx.channel;
        this.guild = ctx.guild;
        this.member = ctx.member;
        this.client = ctx.client;
        this.isAdmin = isAdmin;
        this.isInline = isInline;
        this.inlineCallback = inlineCallback;
    }
    reply(message){
        if(message.allowedMentions){message.allowedMentions['everyone']=false;} else {message.allowedMentions={'everyone':false}};
        
        if(this.ctx.reply==null){
            this.ctx.channel.send(message);
        } else {this.ctx.reply(message)}
    }
    textReply(text,ping=false){
        text=filterText(text);
        if(this.isInline){
            this.inlineCallback(text);
        } else {
        //if text is empty add zero width space
        if(text==""||text==null){text="\u200b"}
        this.reply({content: text, allowedMentions: {repliedUser: ping}});
        }
    }
    channelSend(message){
        if(this.isInline){throw new commandError("noInlineSupport");};
        this.ctx.channel.send(message);
    }
    channelSendText(text,ping=false){
        text=filterText(text);
        if(this.isInline){
            this.inlineCallback(text);
        } else {
        //if text is empty add zero width space
        if(text==""){text="\u200b"}
        this.ctx.channel.send({content: text, allowedMentions: {repliedUser: ping, everyone: false}});
        }
    }

    textEmbedReply(title="title", description="description"){
        let embed = new discord.MessageEmbed();
        embed.setTitle(title);
        embed.setDescription(description);
        if(!this.flags.raw){
        this.reply({embeds:[embed], allowedMentions:{repliedUser:false}});
        } else {
            //compile to text
            let text = "";
            text += "```" + "\n";
            text += title + "\n";
            text += description + "\n";
            text += "```" + "\n";
            this.textReply(text);
        }
    }
    listEmbedReply(title="title", description="description", list="a:b"){
        let embed = new discord.MessageEmbed();
        embed.setTitle(title);
        embed.setDescription(description);
        //split by newline and make everything before : the title and after it the description
        let splitList = list.trim().split("\n");
        console.log(splitList);
        splitList.forEach(a=>{
            if(!a.includes(null)){
            let split = a.split(":");
            if(split[0]!=null&&split[1]!=null){
                console.log(split);
               embed.addField(split[0],split[1]);
            }
        }
        });
        if(!this.flags.raw){
        this.reply({embeds:[embed], allowedMentions:{repliedUser:false}});
        } else {
            //compile to text
            let text = "";
            text += "```" + "\n";
            text += title + "\n";
            text += description + "\n";
            text += list + "\n";
            text += "```" + "\n";
            this.textReply(text);
    }
}
    imageEmbedReply(title="title", description="description", image="image"){
        if(this.isInline){throw new commandError("noTextReturned");};
        let embed = new discord.MessageEmbed();
        embed.setTitle(title);
        embed.setDescription(description);
        embed.setImage(image);
        if(!this.flags.raw||!this.isInline){
        this.reply({embeds:[embed], allowedMentions:{repliedUser:false}});
        }
    }

    pagedImageEmbedReply(title="title", description="description", images=[], voteButtons=false, voteCallback=()=>{}){
        if(this.isInline){throw new commandError("noTextReturned");};
        let embed = new discord.MessageEmbed();
        embed.setTitle(title);
        embed.setDescription(description);
        let page = 0;
        let prevButton = new discord.MessageButton().setLabel("◀").setStyle("DANGER").setCustomId("prev");
        let nextButton = new discord.MessageButton().setLabel("▶").setStyle("SUCCESS").setCustomId("next");
        let closeButton = new discord.MessageButton().setLabel("X").setStyle("PRIMARY").setCustomId("close");
        let row = new discord.MessageActionRow().addComponents(prevButton).addComponents(closeButton).addComponents(nextButton);
        if(voteButtons){
        let voteButton = new discord.MessageButton().setLabel("upvote").setStyle("PRIMARY").setCustomId("vote");
        row.addComponents(voteButton);
        }
        //add images[0] to embed
        embed.setImage(images[0]);
        this.ctx.channel.send({embeds:[embed],components:[row],allowedMentions:{repliedUser:false}}).then(msg=>{
            //await interactions
            const filter = (interaction) => interaction.customId === 'close' || interaction.customId === 'next' || interaction.customId === 'prev';
            let collector = msg.createMessageComponentCollector(filter, {time: 60000});
            collector.on('collect', interaction => {
                if(interaction.customId=="close"){
                    msg.delete();
                }
                if(interaction.customId=="next"){
                    page++;
                    if(page>=images.length){page=0;}
                    embed.setImage(images[page]);
                    interaction.update({embeds:[embed],components:[row],allowedMentions:{repliedUser:false}});
                }
                if(interaction.customId=="prev"){
                    page--;
                    if(page<0){page=images.length-1;}
                    embed.setImage(images[page]);
                    row.removeComponents(prevButton);
                    interaction.update({embeds:[embed],components:[row],allowedMentions:{repliedUser:false}});
                }
                if(interaction.customId=="vote"){
                    voteCallback(interaction.user.id, images[page]);
                    interaction.update({});
                }
            });
            });        
        }
    

    awaitMessage(callback){
        if(this.isInline){throw new commandError("awaitsUserInput")};
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
        let first = text.substring(0,150);
        text=first+"... [too long]```";
    }}
    if(typeof text=="object"){
        if(text.content.includes("@everyone")){text.content="bruh @everyone doesnt work on this bot";}
        if(text.content.length>2000){
            let first = text.content.substring(0,150);
            text.content=first+"... [too long]```";
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

function parseArg(type,input){
    if(input==null){return null;}
    //check if argParsers contains type
    if(Object.keys(argParsers).includes(type)){
        return argParsers[type](input);
    } else { throw "sus"; }
}






let argParsers = {
    "user":parseUserArg,
    "string":(input)=>input,
    "number":(input)=>{let out=parseInt(input);if(isNaN(out)){throw "not a number";}else{return out;}},
    "boolean":(input)=>{if(input=="true"){return true;}else if(input=="false"){return false;}else{throw "not a boolean";}},
    "channel":(input)=>{let chan=client.channels.cache.get(input);if(chan){return chan;}else{throw "channel not found";}},
    "word":(input)=>input,
}

class commandError extends Error{
    constructor(message){
        super(message);
        this.name = "commandError";
    }
}


module.exports=
{
    command:command,
    commandError:commandError,
    handle:handle,
    client:client,
    argParsers:argParsers,
    addMessageListener:addMessageListener,
}













