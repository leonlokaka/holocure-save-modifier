/*
    TODO:
    Layout
    Allow choosing items and weapons
*/
const mainForm = document.getElementById("mainForm");
const inputBox = document.getElementById("input");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};

class Save {
    constructor(textSave) {
        try {
            var jsonStartText = '{ "';
            var jsonStartIndex = textSave.indexOf(jsonStartText);
            // if (jsonStartIndex < 0) {
            //   jsonStartText = '{"';
            //   jsonStartIndex = textSave.indexOf(jsonStartText);
            // }
            this.key = textSave.substring(0, jsonStartIndex);
            var textData = textSave.substring(jsonStartIndex);
            textData = textData.substring(0, textData.lastIndexOf("}") + 1);
            this.data = JSON.parse(textData);
            if (!this.key || !this.data) throw Exception();
        } catch (err) {
            this.data = {};
        }
    }
    toString() {
        return this.key + JSON.stringify(this.data);
    }
}

class SaveModifier {
    parse(rawSave) {
        try {
            this.textSave = this.decode(rawSave);
            console.log(this.textSave);
            this.save = new Save(this.textSave);
        } catch (err) {
            console.error('SaveModifier');
            this.save = new Save();
        }
    }

    decode(rawSave) {
        return atob(rawSave).replaceAll("\\\\", "\\\\");
    }

    encode(saveObj) {
        var str = saveObj.toString();
        return btoa(str.replaceAll("\\\\\\\\", "\\").replace('{"', '{ "'));
    }

    getEncodedSave() {
        if (this.save && this.save.key && this.save.data) return this.encode(this.save);
        return "";
    }
}

function print(txt) {
    console.log(txt);
    document.getElementById("output").innerText = txt;
}

function main() {
    Rx.Observable.fromEvent(inputBox, "change").subscribe((event) => {
        inputUpdated();
    });

    Rx.Observable.fromEvent(mainForm, "change").subscribe((event) => {
        console.log("form updated");
        modifier = formToData(modifier);
        print(modifier.getEncodedSave());
    });

    const modifierObservable = Rx.Observable.of(modifier);
    modifierObservable.subscribe((event) => {
        console.log("modifier updated", event);
        print(modifier.getEncodedSave());
    });
}
function formToData(modifier) {
    var data = modifier.save.data;
    Object.keys(data).forEach((itemKey) => {
        var ele = document.getElementById(itemKey);
        if (ele) {
            // if(ele.getAttribute('data-type') == "characters"){
            // }else
            modifier.save.data[itemKey] = Number.parseInt(
                document.getElementById(itemKey).value
            );
        }
    });

    Object.keys(data.characters).forEach((itemKey) => {
        var [character, value] = data.characters[itemKey];
        var ele = document.getElementById(character);
        if (ele) {
            data.characters[itemKey][1] = Number.parseInt(
                document.getElementById(character).value
            );
        }
    });

    return modifier;
}
function dataToForm(modifier) {
    var data = modifier.save.data;
    Object.keys(data).forEach((itemKey) => {
        if (document.getElementById(itemKey)) {
            document.getElementById(itemKey).value = data[itemKey];
        }
    });
    Object.keys(data.characters).forEach((itemKey) => {
        var [character, value] = data.characters[itemKey];
        if (document.getElementById(character)) {
            document.getElementById(character).value = value;
        }
    });
}
function inputUpdated() {
    console.log("input updated");
    try {
        var rawSave = inputBox.value;
        modifier.parse(rawSave);

        modifier.save.data.unlockedItems = [
            "BodyPillow",
            "FullMeal",
            "PikiPikiPiman",
            "SuccubusHorn",
            "Headphones",
            "UberSheep",
            "HolyMilk",
            "Sake",
            "FaceMask",
            "CreditCard",
            "GorillasPaw",
            "IdolCostume",
            "StudyGlasses",
            "InjectionAsacoco",
            "EnergyDrink",
            "Plushie",
            "SuperChattoTime",
            "PiggyBank",
            "Halu",
            "Membership",
            "Bandaid",
            "GWSPill",
            "ChickensFeather",
            "Limiter"
        ];

        // modifier.save.data.tears = [
        //     [
        //         "myth",
        //         0.0
        //     ],
        //     [
        //         "councilHope",
        //         0.0
        //     ],
        //     [
        //         "gamers",
        //         0.0
        //     ],
        //     [
        //         "gen0",
        //         8.0
        //     ],
        //     [
        //         "gen1",
        //         0.0
        //     ]
        // ];
        modifier.save.data.unlockedStages = [
            "STAGE 1",
            "STAGE 2",
            "STAGE 1 (HARD)"
        ];
        modifier.save.data.unlockedWeapons = [
            "PsychoAxe",
            "Glowstick",
            "SpiderCooking",
            "Tailplug",
            "BLBook",
            "EliteLava",
            "HoloBomb",
            "HoloLaser",
            "CuttingBoard",
            "IdolSong",
            "WamyWater",
            "CEOTears",
            "XPotato"
        ];
        modifier.save.data.seenCollabs = [
            "EliteCooking",
            "BreatheInAsacoco",
            "BLLover",
            "MiComet",
            "DragonBeam",
            "FlatBoard",
            "LightBeam",
            "IdolConcert",
            "BrokenDreams",
            "RapDog",
            "StreamOfTears",
            "MariLamy"
        ];
        modifier.save.data.unlockedOutfits = [
            "default",
            "ameAlt1",
            "inaAlt1",
            "guraAlt1",
            "calliAlt1",
            "kiaraAlt1",
            "ameAlt1",
            "irysAlt1",
            "kurokami"
        ];

        dataToForm(modifier);
        print(modifier.getEncodedSave());

        scrollToStep3();
        return true;
    } catch (err) {
        print(err);
    }
    return false;
}


$(document).ready(() => {
    modifier = new SaveModifier();
    main();
})

// save file upload and download

function readSaveDataFile(file) {
    console.log('readSaveDataFile', file);
    var f = file;
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            $('#input').val(e.target.result);
            inputUpdated();
        };
    })(f);
    reader.readAsText(f);

}

function dropHandler(event) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...event.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === 'file') {
                const file = item.getAsFile();
                readSaveDataFile(file);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s)
        [...event.dataTransfer.files].forEach((file, i) => {
            readSaveDataFile(file);
        });
    }
}

function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function handleSaveFileUpload(event) {
    var file = event.target.files[0];
    readSaveDataFile(file);
}

function scrollToStep3() {
    window.scrollTo({
        top: $('#step3').offset().top,
        left: 0,
        behavior: 'smooth'
    });
}

document.getElementById('save_file_uploader').addEventListener('change', handleSaveFileUpload, false);

function download() {
    save('save.dat', document.getElementById("output").value)
}

function save(filename, data) {
    const blob = new Blob([data], { type: 'text' });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}