function msToMicrocenturies(ms) {
    ms = ms / 1000;
    ms = ms / 60;
    ms = ms / 60;
    ms = ms / 24;
    ms = ms / 365.25;
    ms = ms / 100;
    ms=Math.floor(ms*100)/100;
    return {time: ms, unit: "microcenturies"};
}

function msToLightmeters(ms) {
    let seconds = ms / 1000;
    const c = 299792458;
    let lightmeters = seconds * c;
    lightmeters = Math.floor(lightmeters * 100) / 100;
    return {time: lightmeters, unit: "lightmeters"};
}

class unit {
    constructor(name, type, baseConversion) {
        this.type = type;
        this.name = name;
        this.baseConversion = baseConversion;
    }
}

let distanceUnits = [];
let timeUnits = [];
let massUnits = [];
let velocityUnits = [];
let forceUnits = [];
let energyUnits = [];
















