# Gestural_Arpeggiator

A gesture-controlled arpeggiator that lets you sculpt sound with your hands in real time.

An ultrasonic sensor tracks left hand distance to control the spread between notes in the arpeggio pattern. A webcam detects right hand gestures using a trained ML model to select chords from a scale. Audio is generated with Tone.js and visualised with p5.js.

Built with: Python/Flask (WebSocket), Tone.js, p5.js, Google Teachable Machine.

## Getting Started

Open `index.html` in your web browser and start editing `sketch.js`.

## Running Locally

For projects with media files, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

## Resources

- [p5.js 2.0](https://beta.p5js.org/)
- [p5.js Reference](https://p5js.org/reference/)
