import {Metronome} from "./metronome.js";

// stores metronomes so they can be stopped after the tests
let metronomes = [];

function make_metronome(...args) {
    let m = new Metronome(...args);
    metronomes.push(m);
    return m;
}

// stops all started metronomes
afterEach(() => {
    for(let m of metronomes)
        m.stop();
    metronomes = [];
})

test("start throws Error if already started", () => {
    let m = make_metronome(60);
    m.start();
    expect(() => m.start()).toThrow(Error)
})
