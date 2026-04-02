import * as Tone from "tone";

let body = document.getElementById("body");
let spreadSlider = document.getElementById("spread");
let chordSlider = document.getElementById("chord");

body?.addEventListener("click", async () => {
	await Tone.start();
	console.log("audio is ready");

    Tone.getTransport().start();
    // ramp up to 800 bpm over 10 seconds
    Tone.getTransport().bpm.set(120);
    //playNotes();
});


spreadSlider.oninput = function() {
    establishNoteArray(Number(this.value), new chord("D", chordTypes.minor))
}


// function updateValues(){
//     //establishNoteArray(spreadSlider.ariaValueMax,)
// }

class chord {

    constructor(root, type, octave = 0) {
        this.root = root;
        this.type = type;
        this.octave = octave;
    }

    getNoteFromBetweenIntervals(start, end){
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

const chordTypes = { major : [0,4,7],
    minor : [0,3,7],
    dim : [0,3,6]
}


let arpNotes = ["C4", "E4", "G4", "C5", "D5"];

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

let iterations = 5;
let noteDuration = Tone.Time("8n").toSeconds();

const loopA = new Tone.Loop((time) => {
    let cumlTime = time;
    for (let i = 0; i < iterations; i++) {
        let note = selectRandomNote();
        synth.triggerAttackRelease(note, "8t", cumlTime);
        cumlTime += noteDuration;
    }
}, iterations * noteDuration).start(0);


function selectRandomNote() {
    let i = Math.floor(Math.random()*arpNotes.length);
    console.log(i);
    return arpNotes.at(i);
}

function establishNoteArray(spread, chord){
    arpNotes = chord.getNoteFromBetweenIntervals(40,40+spread);
    console.log(arpNotes);
}