let {command} = require("./messageHandler.js"); 

class dataPoint {
    constructor() {
        this.time = Date.now();
        this.memory = process.memoryUsage.rss();
        //get discord.js stats
        this.channelCount = client.channels.cache.size;
        this.guildCount = client.guilds.cache.size;
        this.userCount = client.users.cache.size;
        //this.messageCount = client.channels.cache.reduce((a, b) => a + b.messages.cache.size, 0);
        //count messages that start with "p2"
        //this.commandUses = client.channels.cache.reduce((a, b) => a + b.messages.cache.filter(m => m.content.startsWith("p2")).size, 0);
        this.commandCount = Object.keys(command.list).length;
    }
}

let data = [];
let dataInterval = setInterval(() => {
    data.push(new dataPoint());
    if (data.length > 60) {
        data.shift();
    }
}, 10000);


function normalize(array){
    let max = 0;
    for(let i=0;i<array.length;i++){
        if(array[i]>max){
            max = array[i];
        }
    }
    let newArray = [];
    for(let i=0;i<array.length;i++){
        newArray.push(array[i]/max);
    }
    return newArray;
}

function getDiagram(array){
    let diagram = "";
    let normalized = normalize(array);
    for(let i=0;i<normalized.length;i++){
        diagram += "▁▂▃▄▅▆▇█".charAt(Math.floor(normalized[i]*10));
    }
    return diagram;
}

function botStatCmd(handler){
    //get diagrams for every stat
    let timeDiagram = getDiagram(data.map(d => d.time));
    let memoryDiagram = getDiagram(data.map(d => d.memory));
    let channelCountDiagram = getDiagram(data.map(d => d.channelCount));
    let guildCountDiagram = getDiagram(data.map(d => d.guildCount));
    let userCountDiagram = getDiagram(data.map(d => d.userCount));
    //let messageCountDiagram = getDiagram(data.map(d => d.messageCount));
    //let commandUsesDiagram = getDiagram(data.map(d => d.commandUses));
    let commandCountDiagram = getDiagram(data.map(d => d.commandCount));

    let statList = "";
    statList += "memory: "+memoryDiagram+"\n";
    statList += "channels: "+channelCountDiagram+"\n";
    statList += "guilds: "+guildCountDiagram+"\n";
    statList += "users: "+userCountDiagram+"\n";
    //statList += "messages: "+messageCountDiagram+"\n";
    statList += "commands: "+commandCountDiagram;
    //statList += "command uses: "+commandUsesDiagram+"\n";
    //handler.listEmbedReply("bot stats", "various performance-related info", statList);
    handler.listEmbedReply();
}
let statCmdObj = new command("stats", botStatCmd, ["string"], "info", false);
command.load(statCmdObj);








