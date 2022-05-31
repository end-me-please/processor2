const {command} = require("../util/messageHandler.js");
const akinator = require("discord.js-akinator");


//Example options
const language = "en"; //The Language of the Game
const childMode = false; //Whether to use Akinator's Child Mode
const gameType = "character"; //The Type of Akinator Game to Play. ("animal", "character" or "object")
const useButtons = true; //Whether to use Discord's Buttons
const embedColor = "#1F1E33"; //The Color of the Message Embeds


function akiCommand(handler) {
        akinator(handler.ctx, {
            language: language, //Defaults to "en"
            childMode: childMode, //Defaults to "false"
            gameType: gameType, //Defaults to "character"
            useButtons: useButtons, //Defaults to "false"
            embedColor: embedColor //Defaults to "RANDOM"
        });
    }
let aki=new command("aki",akiCommand,["string"],"play some kind of game stolen from somewhere","fun",false);
command.load(aki);




//base64 encode/decode
function b64ecmd(handler) {
    let text=handler.args[0];
    let encoded=Buffer.from(text).toString("base64");
    handler.textReply(encoded);
}
let b64e=new command("b64e",b64ecmd,["string"],"encode to base64","cryptography",false);
command.load(b64e);

function b64dcmdd(handler) {
    let text=handler.args[0];
    let decoded=Buffer.from(text,"base64").toString();
    handler.textReply(decoded);
}
let b64d=new command("b64d",b64dcmdd,["string"],"decode from base64","cryptography",false);
command.load(b64d);

//number to binary
function binarycmd(handler) {
    let text=handler.args[0];
    //go through each character, and convert to binary
    let binary="";
    for(let i=0;i<text.length;i++){
        binary+=text.charCodeAt(i).toString(2)+" ";
    }
    handler.textReply(binary);
}
let binary=new command("binencode",binarycmd,["string"],"convert to binary","cryptography",false);
command.load(binary);
//decode from binary
function binarydecmd(handler) {
    let text=handler.args[0];
    //go through each character, and convert to binary
    let decoded="";
    let maxLength=text.split(" ").length;
    for(let i=0;i<maxLength;i++){
        decoded+=String.fromCharCode(parseInt(text.split(" ")[i],2));
    }
    handler.textReply(decoded);
}
let binarydec=new command("bindecode",binarydecmd,["string"],"decode binary","cryptography",false);
command.load(binarydec);

function xorCmd(handler) {
    let text=handler.args[0].split("^")[0];
    let key=handler.args[0].split("^")[1];
    let xored="";
    for(let i=0;i<text.length;i++){
        xored+=String.fromCharCode(text.charCodeAt(i)^key.charCodeAt(i%key.length));
    }
    handler.textReply(xored);
}
let xor=new command("xor",xorCmd,["string"],"xor two strings, separated by ^ ","cryptography",false);
xor.hidden=true;
command.load(xor);
