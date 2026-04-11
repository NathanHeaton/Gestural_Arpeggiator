//import * as Tone from "../tone";
const socket = io();

let distance = 0;

socket.on("distance", data => {
	distance = data;
	console.log(distance);
    distance = Math.round(distance+ 5);
    spread = distance;
    if (spread < 10){
        spread = 10
    }
    else if (spread > 48){
        spread = 48
    }
	});
	
	
const chordTypes = { major : [0,4,7],
    minor : [0,3,7],
    dim : [0,3,6]
}


const scaleTypes = [
    {   name :"Ionian",
        steps:  [0, 2, 4, 5, 7, 9, 11], 
        chords: ["major", "minor", "minor", "major", "major", "minor", "dim"]
    },
    {   name :"Dorian",
        steps:  [0, 2, 3, 5, 7, 9, 10],
        chords: ["minor", "minor", "major", "major", "minor", "dim", "major"]
    },
    {   name :"Phrygian",
        steps:  [0, 1, 3, 5, 7, 8, 10],
        chords: ["minor", "major", "major", "minor", "dim", "major", "minor"]
    },
    {   name :"Lydian",
        steps:  [0, 2, 4, 5, 6, 9, 10],
        chords: ["major", "major", "minor", "dim", "major", "minor", "minor"]
    },
    {   name :"Mixolydian",
        steps:  [0, 2, 4, 5, 7, 9, 10],
        chords: ["major", "minor", "dim", "major", "minor", "minor", "major"]
    },
    {   name :"Aeolian",
        steps:  [0, 2, 3, 5, 7, 8, 10],
        chords: ["minor", "dim", "major", "minor", "minor", "major", "major"]
    },
    {   name :"Locrian",
        steps:  [0, 1, 3, 5, 6, 8, 10],
        chords: ["dim", "major", "minor", "minor", "major", "major", "minor"]
    },
]
let arpNotes = ["C4", "E4", "G4", "C5", "D5"];
let midiNotes = [];

let body = document.getElementById("body");

let spreadSlider = document.getElementById("spread");
let chordSlider = document.getElementById("chord");
let modeSlider = document.getElementById("mode");
let keySlider = document.getElementById("key");
let pauseButton = document.getElementById("pause");

let firstInteraction = true;


body?.addEventListener("click", async () => {
    if (firstInteraction){
        await Tone.start();
        console.log("audio is ready");
        
        Tone.getTransport().start();
        Tone.getTransport().bpm.value =240;
        
        //Tone.getTransport().bpm.rampTo(800, 10);
        noteDuration = Tone.Time("8n").toSeconds();
        firstInteraction = false;
    }
});

let spread = 7;
let chordInScale = 0;
let scaleKeySignature = "C";
let currentMode = 0;

let justChangedChord = true;

let paused = false;
pauseButton.onclick = function() {
    paused ? masterVol.mute = false : masterVol.mute = true;
    paused = !paused;
}

spreadSlider.oninput = function() {spread = Number(this.value); updateValues();}
chordSlider.oninput = function() {chordInScale = Number(this.value); justChangedChord = true; updateValues();}
modeSlider.oninput = function() {currentMode = Number(this.value); updateValues();}
keySlider.oninput = function() {
    let keyWithOctave =  Tone.Frequency(60 + Number(this.value),"midi").toNote()
    scaleKeySignature = keyWithOctave.slice(0,keyWithOctave.length -1);
     updateValues();}


function updateValues(){
    if (justChangedChord){
        masterVol.volume.value = defaultVol;
        //Tone.getTransport().bpm.value = 240;
        masterVol.volume.exponentialApproachValueAtTime(defaultVol-10, 2);
        //Tone.getTransport().bpm.rampTo(300, 5);
        justChangedChord=false;
    }
    let step = scaleTypes[currentMode].steps[chordInScale]
    let chordRootWithOcatave = Tone.Frequency(Tone.Frequency(scaleKeySignature.concat("4")).toMidi() + step,"midi").toNote(); //+ step;
    let chordRoot = chordRootWithOcatave.slice(0,chordRootWithOcatave.length -1);
    console.log(chordRoot);
    console.log(scaleTypes[currentMode].chords[chordInScale]);
    let chordType = chordTypes[scaleTypes[currentMode].chords[chordInScale]];
    console.log(chordTypes[scaleTypes[currentMode].chords[chordInScale]])
    establishNoteArray(spread, new chord(chordRoot, chordType))
}

class chord {

    constructor(root, type, octave = 0) {
        this.root = root;
        this.type = type;
        this.octave = octave;
    }

    getNotesBetweenInterval(start, end){
        let notes = []
        console.log(start, end);
        let degreeOfChord = 0;
        for (degreeOfChord;degreeOfChord < this.type.length; degreeOfChord++){
            let rootMidi = Tone.Frequency(`${this.root}${this.octave}`).toMidi()+ this.type[degreeOfChord];
            let note = rootMidi + Math.ceil((start - rootMidi) / 12) * 12;
            while (note <= end){
                if (note >= start){
                    notes.push(Tone.Frequency(note,"midi").toNote())
                }
                note += 12;
            }
        }
        return notes;
    }
}

// sets volum to speakers at synth to speakers
let defaultVol = 0;
let masterVol = new Tone.Volume(defaultVol).toDestination();
const synth = new Tone.FMSynth().connect(masterVol);

let iterations = 4;
let noteDuration = Tone.Time("8n").toSeconds();
window.arpNotes = arpNotes;
window.midiNotes = midiNotes;

const loopA = new Tone.Loop((time) => {
    let cumlTime = time;
    for (let i = 0; i < iterations; i++) {

        //let note = selectRandomNote();
        let note = startRootThenRandom(i);

        synth.triggerAttackRelease(note, "8t", cumlTime);
        cumlTime += noteDuration;
    }
}, iterations * noteDuration).start(0);

function sentNoteArray(spread, chord){
    arpNotes = chord.getNotesBetweenInterval(
        arpCenterNote - Math.floor(spread/(3/1)),
        arpCenterNote + Math.round(spread/(3/2))
    );

    for (let i = 0; i < arpNotes.length; i++){
        midiNotes.push(Tone.Frequency(arpNotes.at(i)).toMidi())
    }

    window.arpNotes = midiNotes; // update global reference
}

const fft = new Tone.FFT(256);
masterVol.connect(fft);

window.fft = fft;

function selectRandomNote() {
    let i = Math.floor(Math.random()*arpNotes.length);
    return arpNotes.at(i);
}

let previousNote = undefined;
const MAX_JUMP_DISTANCE = 17;
function startRootThenRandom(index){
    if (index == 0){return arpNotes.at(0);}

    let Notes = arpNotes;
    if (previousNote != undefined){
        Notes = getSubSetOfArray(previousNote, MAX_JUMP_DISTANCE);
    }
    console.log(Notes);

    let RNoteIndex = Math.floor(Math.random()*Notes.length);
    let note = Notes.at(RNoteIndex)

    previousNote = note;
    return note; 
}

function getSubSetOfArray(previousNote, distance){
    let subSet = []
    let centerNote = Tone.Frequency(previousNote).toMidi();
    for (let i = 0; i < arpNotes.length;i++){
        let noteInMidi = Tone.Frequency(arpNotes.at(i)).toMidi();
        if (noteInMidi > centerNote - distance && noteInMidi < centerNote + distance){
            subSet.push(arpNotes.at(i));
        }
    }
    if (subSet.length == 0){
        return arpNotes;
    }
    return subSet;

}
const arpCenterNote = 60;

function establishNoteArray(spread, chord){
    arpNotes = chord.getNotesBetweenInterval(arpCenterNote-Math.floor(spread/(3/1)),arpCenterNote+ Math.round(spread/(3/2)));
    //console.log(arpNotes);

    midiNotes = [];
    for (let i = 0; i < arpNotes.length; i++){
        midiNotes.push(Tone.Frequency(arpNotes.at(i)).toMidi())
    }
    console.log("midi Notes", midiNotes)
    window.midiNotes = midiNotes; // update global reference
}
