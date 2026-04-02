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

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

let iterations = 5;
let noteDuration = Tone.Time("8n").toSeconds();

const loopA = new Tone.Loop((time) => {
    let cumlTime = time;
    for (let i = 0; i < iterations; i++) {
        synth.triggerAttackRelease("C5", "8t", cumlTime);
        cumlTime += noteDuration;
    }
}, iterations * noteDuration).start(0);
