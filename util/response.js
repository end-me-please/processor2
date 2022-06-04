const discord = require('discord.js');

class commandResponse {
    constructor(message, flags) {
        this.message = message;
        this.flags = flags;
        this.text = null;
        this.embed = false;
        this.image = null;
        this.buttons = [];
    }
    addText(text) {
        this.text = text;
        return this;
    }
    addImage(image) {
        this.image = image;
        return this;
    }
    addButton(label, callback=()=>{}, style="PRIMARY") {
        this.buttons.push({
            label: label,
            callback: callback,
            style: style
        });
    }
    send(){

        if(this.buttons.length>0){
            //create a new messageActionRow
            let messageActionRow = new discord.MessageActionRow();
            //add the buttons to the messageActionRow
            for(let i=0;i<this.buttons.length;i++){
                let newButton = new discord.MessageActionButton().setLabel(this.buttons[i].label).setStyle(this.buttons[i].style).setCustomId("{button:"+i+"}");
            }
        } //UNFINISHED
        
    }



    embedFormat(text){
        //new embed
        let embed = new discord.MessageEmbed();
        //if text contains newline, set title to first line
        if(text.includes("\n")){
            let title = text.split("\n")[0];
            text = text.replace(title+"\n","");
            embed.setTitle(title);
        };
        //find text inside of <field_name : field_description> and add it to embed
        let fields = text.match(/<(.*?):(.*?)>/g);
        if(fields){
            for(let i=0;i<fields.length;i++){
                let field = fields[i].replace("<","").replace(">","").split(":");
                embed.addField(field[0],field[1]);
            };
        };
        //filter for text outside of <field_name : field_description>
        text = text.replace(/<(.*?):(.*?)>/g,"");
        //set description
        embed.setDescription(text);
        if(this.image){
            embed.setImage(this.image);
        };
        return embed;

    }
}













