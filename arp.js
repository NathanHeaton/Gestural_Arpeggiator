import * as Tone from "tone";

let body = document.getElementById("body");

body?.addEventListener("click", async () => {
	await Tone.start();
	console.log("audio is ready");

    Tone.getTransport().start();
    // ramp up to 800 bpm over 10 seconds
    Tone.getTransport().bpm.set(120);
    //playNotes();
});

let spread = 0;

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