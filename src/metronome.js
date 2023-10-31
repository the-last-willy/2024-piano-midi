"use strict";

export class Metronome extends EventTarget {
    bpm;

    #interval;

    constructor(bpm) {
        super();
        this.bpm = bpm;
        this.#interval = null;
    }

    start() {
        if(this.#interval !== null)
            throw new Error("metronome already started");
        let delay = 1 / this.bpm * 1e3 * 60;
        console.log(delay);
        this.#interval = setInterval(() => this.#tick(), delay);
    }

    stop() {
        clearInterval(this.#interval);
        this.#interval = null;
    }

    #tick() {
        let e = new CustomEvent("ontick");
        this.dispatchEvent(e);
    }
}