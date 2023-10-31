import * as m from "./midi.js";
import {c_major_scale, Exercise} from "./exercise.js";
import {Piano} from "./piano.js";
import {Renderer} from "./renderer.js";
import {MusicSequence, Note} from "./musicsequence.js";
import {Metronome} from "./metronome.js";

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

let renderer = new Renderer();
piano.addEventListener("keypress",
    (e) => renderer.press(e.detail.note));

let sequence = new MusicSequence();

let cMajorScale = [
    ["C", 4],
    ["D", 4],
    ["E", 4],
    ["F", 4],
    ["G", 4],
    ["A", 4],
    ["B", 4],
    ["C", 5],
    ["B", 4],
    ["A", 4],
    ["G", 4],
    ["F", 4],
    ["E", 4],
    ["D", 4],
    ["C", 4],
];

for(let i = 0; i < cMajorScale.length; ++i) {
    let [pitch, octave] = cMajorScale[i];
    sequence.addNote(i*60/120, (() => {
        let note = new Note();
        note.pitch = pitch;
        note.octave = octave;
        return note;
    })())
    sequence.addNote(i*60/120, (() => {
        let note = new Note();
        note.pitch = pitch;
        note.octave = octave - 1;
        return note;
    })())
}

renderer.renderSequence(sequence)

addEventListener("DOMContentLoaded", () => {
    let metronome = new Metronome(240);
    let ticksound = new Audio("./data/metronome-85688.mp3");
    metronome.start();
    metronome.addEventListener("ontick", () => {
        ticksound.pause();
        ticksound.currentTime = 0;
        // ticksound.play();
    });
});
