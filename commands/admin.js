const {command, client} = require("../util/messageHandler.js");


async function evalCommandFunc(handler) {
    let code = handler.args[0];
    let outputString = "result: ```";
    let output=null;

    try {
    output = eval(code);
    } catch (e) {output=e;}

    //check if output is a promise
    if (output instanceof Promise) {
        output = await output;
    }

    if(output==null){
        output="no output";
    }

    //check if output.toString() would be [object Object]
    if (output.toString() === "[object Object]") {
        outputString += JSON.stringify(output);
    } else {
        outputString += output;
    }
    outputString += "```";
    //check if outputString is too long
    if (outputString.length > 2000) {
        output="output too long";
    }

    handler.textReply(outputString);
}

let evalCommand=new command("eval",evalCommandFunc,["string"],"evaluate js","admin",true);
command.load(evalCommand);



//context command, executes every command sent by a user
async function contextCommandFunc(handler) {
    //collect new messages from the user
    let channel = handler.ctx.channel;
    //create a message collector
    let collector = channel.createMessageCollector(m => m.author.id === handler.ctx.author.id, {time: 60000});
    //collect the messages
    collector.on('collect', m => onCollect(m));

    function onCollect(msg) {
        if (msg.author.id === handler.ctx.author.id) {
            if(msg.content.startsWith(handler.prefix)){
                //return if the message is a command
                return;
            }
            //check if message content is "stop"
            if (msg.content === "stop") {
                collector.stop();
                handler.textReply("stopped");
                return;
            }
            msg.content = "p2 eval " + msg.content;
            command.list["eval"].run(msg);
        }
    }
}
let consoleCommand=new command("console",contextCommandFunc,["string"],"for js testing","admin",true, false, true);
command.load(consoleCommand);








//read stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');
//allow sending commands from stdin
process.stdin.on('data', function (text) {
    if (text.trim() === "exit") {
        process.exit();
    };
    //split into words
    let words = text.split(" ");
    if(words[0]=="echo"){
        client.channels.cache.get("935956434259177483").send(words.slice(1).join(" "));        
    }

});















