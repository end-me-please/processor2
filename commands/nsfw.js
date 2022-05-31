let command = require("../util/messageHandler.js").command;
let hmtai = require("hmtai");

const frogArray=["https://cdn.discordapp.com/attachments/935905624737337395/954369510062845982/rayna_bell_-_litoria_revelata-040.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954369746751594496/9k.png",
"https://media.discordapp.net/attachments/935905624737337395/954369830172102696/7958091f5675adc079db2d5485793540.png?width=345&height=473",
"https://cdn.discordapp.com/attachments/935905624737337395/954369940394229790/c4ab8172f727f2e7579c760de3e6a96d.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954370027556053032/great-barred-frogs-mating-two-forest-floor-night-209151195.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954370087207448676/ghows-FD-86a82e9b-9e60-0dda-e053-0100007f24a4-919751e3.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954370180237127690/d4828b6098344b96a257039fcb6662e6.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954370343240364083/1000_F_31565918_OOOHwf5WHsFsPOiKgKhzDBgZUvDzaY3p.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954370818505330688/green-tree-frogs.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954370966346137651/mating_frogs_1600.png",
"https://cdn.discordapp.com/attachments/935905624737337395/954371040665034812/image009.png",
];

function nsfwCmd(handler){
    //check if category is valid
    
    let category = "";
    
    if(handler.args[0]==null){
        //category=Object.keys(hmtai.nsfw)[Math.floor(Object.keys(hmtai.nsfw).length*Math.random())];console.log("picking random..")
        category=Object.keys(hmtai.nsfw)[Math.floor(Math.random()*30)];console.log("picking random.."+category);
    }else{category=handler.args[0]};


    if(category!="frog"&&!Object.keys(hmtai.nsfw).includes(category)){handler.textReply("available categories: ```"+Object.keys(hmtai.nsfw)+"```");return};
    

    let res=[];
    if(category!="frog"){
        for(let i=0;i<40;i++){
            res.push(hmtai.nsfw[category]());
        }
    }else{
        res=frogArray;
    }

    handler.pagedImageEmbedReply("catetory: "+category,"here are your images",res);

}
let nsfw = new command("nsfw",nsfwCmd,["word"],"obtain images","nsfw",false,true);
command.load(nsfw);






