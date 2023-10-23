import * as m from "./midi.js";
import {c_major_scale, Exercise} from "./exercise.js";
import {Piano} from "./piano.js";

const {Factory, EasyScore, Stave, StaveNote, System, TickContext} = Vex.Flow;

navigator.permissions.query({name: "midi", sysex: true}).then((result) => {
    if (result.state === "granted") {
        // Access granted.
    } else if (result.state === "prompt") {
        // Using API will prompt for permission
    }
    // Permission was denied by user prompt or permission policy
});

let midi = null; // global MIDIAccess object

let piano = new Piano()

function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");
    midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
    listInputsAndOutputs(midi);
    let select = document.getElementById("midi-input");
    select.onchange = () => {
        console.log(`Selected ${select.value}.`)
        startLoggingMIDIInput(midi,);
    }
    for (let [id, input] of midi.inputs) {
        let option = document.createElement("option");
        option.label = input.name;
        option.value = input.id;
        select.add(option);
    }
}

function onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
        const input = entry[1];
        console.log(
            `Input port [type:'${input.type}']` +
            ` id:'${input.id}'` +
            ` manufacturer:'${input.manufacturer}'` +
            ` name:'${input.name}'` +
            ` version:'${input.version}'`,
        );
    }

    for (const entry of midiAccess.outputs) {
        const output = entry[1];
        console.log(
            `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
        );
    }
}

let exercise = new Exercise(c_major_scale())
exercise.addEventListener('playcorrectnote', () => {
    console.log('oui')
})
exercise.addEventListener('playincorrectnote', () => {
    let audio = new Audio('./data/new-information-153314.mp3');
    audio.play();
})

function onMIDIMessage(event) {
    let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    let e = new m.MidiEvent(event.data)
    console.log(e)
    if (e.name === 'KeyOnEvent')
        piano.press(m.key_to_english_name.get(e.key))
    else if (e.name === 'KeyOffEvent') {
        piano.release(m.key_to_english_name.get(e.key))
    }
}

function startLoggingMIDIInput(midiAccess, indexOfPort) {
    midiAccess.inputs.forEach((entry) => {
        entry.onmidimessage = onMIDIMessage;
    });
}

const vf = new Factory({
    renderer: {elementId: 'output', width: 1000, height: 300},
});

let ctx = vf.getContext();

let stave = new Stave(0, 50, 900).addClef('treble');
stave.setContext(ctx).draw();

let noteGroups = []

let firstTime = null;

function clearStave() {
    for(let g of noteGroups) {
        g.remove();
    }
    noteGroups = []
    firstTime = null;
}

let interval = null

piano.addEventListener("keypress", (e) => {
    if(firstTime === null)
        firstTime = Date.now();
    if(interval === null)
        interval = setInterval(() => clearStave(), 10 * 1e3);

    let toNote = (x) => x[0] + '/' + x[1];

    let tickCtx = new TickContext();
    let note = new StaveNote({
        clef: 'treble',
        keys: [toNote(e.detail.note)],
        duration: 4
    });
    let x = (Date.now() - firstTime) / 1e3 * 100;
    note.setContext(ctx).setStave(stave);
    tickCtx.addTickable(note);
    tickCtx.preFormat().setX(x);
    let g = ctx.openGroup()
    note.draw();
    ctx.closeGroup()
    noteGroups.push(g)
})

