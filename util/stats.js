let {command, addMessageListener} = require("./messageHandler.js"); 


let messageActivity = 0;

function countMessage(message){
    messageActivity++;
}
addMessageListener(countMessage);

class dataPoint {
    constructor() {
        this.time = Date.now();
        this.memory = process.memoryUsage.rss();
        //get discord.js stats
        this.channelCount = client.channels.cache.size;
        this.guildCount = client.guilds.cache.size;
        this.userCount = client.users.cache.size;
        this.messageActivity = messageActivity;
        messageActivity = 0;

    }
}

data = [];
let dataInterval = setInterval(() => {
    data.push(new dataPoint());
    if (data.length > 1200) {
        data.shift();
    }
}, 120000);


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
    console.log(newArray);
    return newArray;
}

function getDiagram(array){
    //console.log(array);
    let diagram = [];
    //take the last 30 values
    let last30 = array.slice(-30);
    let normalized = normalize(last30);
    
    for(let i=0;i<normalized.length;i++){
        diagram.push("▁▂▃▄▅▆▇█"[Math.floor((normalized[i]*2-1)*7.99)]);
    }
    console.log(diagram);
    return "```"+diagram.join("")+"```";
}

function squeeze(array,targetLength){
    let newArray = [];
    //interpolate or decimate depending on the length of the array
    //smooth the data
    let step = array.length/targetLength;
    for(let i=0;i<targetLength;i++){
        let sum = 0;
        for(let j=0;j<step;j++){
            sum+=array[Math.floor(i*step+j)];
        }
        newArray.push(sum/step);
    }
    return newArray;
}







function botStatCmd(handler){
    if(data.length<2){
        handler.textReply("not enough data");
        return;
    }
    //get diagrams for every stat
    
    let memoryDiagram = getDiagram(data.map(d => d.memory));
    let channelCountDiagram = getDiagram(data.map(d => d.channelCount));
    let guildCountDiagram = getDiagram(data.map(d => d.guildCount));
    let userCountDiagram = getDiagram(data.map(d => d.userCount));
    let messageCountDiagram = getDiagram(data.map(d => d.messageActivity));
 
    let statList = "";
    statList += "memory: "+memoryDiagram+"\n";
    statList += "channels: "+channelCountDiagram+"\n";
    statList += "guilds: "+guildCountDiagram+"\n";
    statList += "users: "+userCountDiagram+"\n";
    statList += "messages: "+messageCountDiagram+"\n";
    handler.listEmbedReply("bot stats", "various performance-related info", statList);
}
let statCmdObj = new command("stats", botStatCmd, ["string"], "info", false);
command.load(statCmdObj);








