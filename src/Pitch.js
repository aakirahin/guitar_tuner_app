import Sketch from 'react-p5';
import * as ml5 from 'ml5'
import { tunings } from './utils/tuning';

function Pitch({ tuning }) {
  const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/'
  let pitch
  let audioContext
  let mic
  let freq = 0
  let threshold = 1

  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(800, 700).parent(canvasParentRef);

    audioContext = new AudioContext()
    mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    
    startListening(mic, audioContext);
  }

  const startListening = (mic, audioContext) => {
    audioContext.resume().then(() => {
        console.log("Listening!")
        pitch = ml5.pitchDetection(modelUrl, audioContext, mic, modelLoaded)
    })
  }

  function checkFreq(err, frequency) {
    if (err) console.error(err);
    else freq = frequency ?? 0

    pitch.getPitch(checkFreq);
  }

  const modelLoaded = () => {
    console.log("Model loaded!")
    pitch.getPitch(checkFreq)
  }

  const draw = (p5) => {
    // BACKGROUND
    p5.background(255);

    // IDENTIFYING NOTE
    let t = tunings[tuning]
    let closestNote = -1
    let recordDiff = Infinity

    for (let i = 0; i < t["notes"].length; i++) {
      let diff = freq - t["notes"][i]["freq"]
      if (p5.abs(diff) < p5.abs(recordDiff)) {
        closestNote = t["notes"][i]
        recordDiff = diff
      }
    }

    let diff = recordDiff
    
    // BOX
    p5.fill(255)
    p5.stroke(0)
    p5.strokeWeight(2)
    if (p5.abs(diff) < threshold) p5.fill(154,216,117)
    p5.rect(200, p5.height/2 + 200, 400, 90)

    // MIDDLE LINE
    p5.stroke(0)
    p5.strokeWeight(5)
    p5.line(p5.width/2, p5.height/2 + 320, 400, 520)

    // RED LINE
    p5.noStroke()
    p5.fill(232,61,61)
    if (p5.abs(diff) < threshold) p5.fill(154,216,117)
    if (freq) p5.rect(200 + diff/2, p5.height/2 + 190, 10, 110);  

    // GUITAR STRINGS + NOTES
    // SIXTH STRING
    p5.stroke(0)
    p5.strokeWeight(12)
    p5.line(800/7, 0, 800/7, 400)

    p5.stroke(0)
    p5.strokeWeight(2)
    p5.fill(closestNote.key === t["notes"][0]["key"] ? 255 : 0)
    p5.circle(800/7, 440, 80)
    p5.fill(closestNote.key === t["notes"][0]["key"]  ? 0 : 255)
    p5.textSize(50)
    p5.text(t["notes"][0]["note"] , 800/7 - 16, 457);

    // FIFTH STRING
    p5.stroke(0)
    p5.strokeWeight(10)
    p5.line(800/7 * 2, 0, 800/7 * 2, 400)

    p5.stroke(0)
    p5.strokeWeight(2)
    p5.fill(closestNote.key === t["notes"][1]["key"] ? 255 : 0)
    p5.circle(800/7 * 2, 440, 80)
    p5.fill(closestNote.key === t["notes"][1]["key"] ? 0 : 255)
    p5.textSize(50)
    p5.text(t["notes"][1]["note"], (800/7 * 2) - 16, 457);

    // FOURTH STRING
    p5.stroke(0)
    p5.strokeWeight(8)
    p5.line(800/7 * 3, 0, 800/7 * 3, 400)

    p5.stroke(0)
    p5.strokeWeight(2)
    p5.fill(closestNote.key === t["notes"][2]["key"] ? 255 : 0)
    p5.circle(800/7 * 3, 440, 80)
    p5.fill(closestNote.key === t["notes"][2]["key"] ? 0 : 255)
    p5.textSize(50)
    p5.text(t["notes"][2]["note"], (800/7 * 3) - 16, 457);

    // THIRD STRING
    p5.stroke(0)
    p5.strokeWeight(6)
    p5.line(800/7 * 4, 0, 800/7 * 4, 400)

    p5.stroke(0)
    p5.strokeWeight(2)
    p5.fill(closestNote.key === t["notes"][3]["key"] ? 255 : 0)
    p5.circle(800/7 * 4, 440, 80)
    p5.fill(closestNote.key === t["notes"][3]["key"] ? 0 : 255)
    p5.textSize(50)
    p5.text(t["notes"][3]["note"], (800/7 * 4) - 19, 457);

    // SECOND STRING
    p5.stroke(0)
    p5.strokeWeight(4)
    p5.line(800/7 * 5, 0, 800/7 * 5, 400)

    p5.stroke(0)
    p5.strokeWeight(2)
    p5.fill(closestNote.key === t["notes"][4]["key"] ? 255 : 0)
    p5.circle(800/7 * 5, 440, 80)
    p5.fill(closestNote.key === t["notes"][4]["key"] ? 0 : 255)
    p5.textSize(50)
    p5.text(t["notes"][4]["note"], (800/7 * 5) - 16, 457);

    // FIRST STRING
    p5.stroke(0)
    p5.strokeWeight(2)
    p5.line(800/7 * 6, 0, 800/7 * 6, 400)

    p5.stroke(0)
    p5.strokeWeight(2)
    p5.fill(closestNote.key === t["notes"][5]["key"] ? 255 : 0)
    p5.circle(800/7 * 6, 440, 80)
    p5.fill(closestNote.key === t["notes"][5]["key"] ? 0 : 255)
    p5.textSize(50)
    p5.text(t["notes"][5]["note"], (800/7 * 6) - 16, 457);
  }

  return (
    <div id="sketch">
        <Sketch setup={setup} draw={draw}/>
    </div>
  )
}

export default Pitch;
