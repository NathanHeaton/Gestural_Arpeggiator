let spectrum;
let startMidi = 42;
let endMidi = 94;

function setup() {
    createCanvas(1200, 600);
}

function draw() {
    background(30);

    if (window.midiNotes && window.midiNotes.length > 0) {
        let lowNote = Math.min(...window.midiNotes);
        let highNote = Math.max(...window.midiNotes);
        
        let xStart = map(lowNote, startMidi, endMidi, 0, width);
        let xEnd = map(highNote, startMidi, endMidi, 0, width);
        
        noStroke();
        fill(0, 212, 255, 30);
        rect(xStart, 0, xEnd - xStart, height - 100);
        
        stroke(0, 212, 255, 100);
        line(xStart, 0, xStart, height - 100);
        line(xEnd, 0, xEnd, height - 100);
    }

    if (window.fft) {
        spectrum = window.fft.getValue();
        noStroke();
        fill(255, 255, 255, 50);
        for (let i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length, 0, width);
            let h = map(spectrum[i], -100, 0, 0, height/2);
            rect(x, height - 100, width / spectrum.length, -h);
        }
    }
    drawKeyboardFeedback();
}

function drawKeyboardFeedback() {
    let keyWidth = width / (endMidi - startMidi + 1); 
    for (let m = startMidi; m <= endMidi; m++) {
        let x = map(m, startMidi, endMidi, 0, width - keyWidth);
        let isActive = window.midiNotes && window.midiNotes.includes(m);
        
        if (isActive) {
            fill(0, 212, 255);
            stroke(255);
        } else {
            fill(50);
            stroke(30);
        }
        
        rect(x, height - 100, keyWidth, 100, 5);
    }
}
