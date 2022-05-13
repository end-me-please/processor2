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





