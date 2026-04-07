let img1;

async function setup() {
  createCanvas(800, 600);
  img1 = await loadImage("assets/keyboard.jpg");
}

function draw() {
  background(220);

  if (img1) {
    image(img1, 0, 450, 800, 150);
  }
}
