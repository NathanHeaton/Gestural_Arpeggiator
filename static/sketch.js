let img1;
let spectrum;
let waveform = [];

async function setup() {
  createCanvas(800, 600);
  img1 = await loadImage("assets/keyboard.jpg");
}

function draw() {
  background(220);

  if (img1) {
    image(img1, 0, 450, 800, 150);
  }

  if (window.fft) {
    spectrum = window.fft.getValue();

    for (let i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, 0, width);
      let h = map(spectrum[i], -200, 0, height, 1);

      rect(x, height, width / spectrum.length, -h);
    }
  }

  if (window.midiNotes) {
    //console.log(midiNotes)
    text(window.midiNotes.join(", "), 50, 50);
  }
}
