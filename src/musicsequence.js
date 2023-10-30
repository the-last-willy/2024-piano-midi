"use strict";

export class Note {
    duration = 4;
    octave = 4;
    pitch = 'C'; 
}

export class MusicSequence {
    notes =[]

    constructor() {

    }

    getTimeSignature() {
        return [4, 4];
    }

    getTempo() {
        return 120;
    }

    getDuration() {
        if(this.notes.length === 0) {
            return 0;
        } else {
            let [time, _] = this.notes.at(-1);
            return time + 1 / 120;
        }
    }

    addNote(time, note) {
        this.notes.push([time, note])
        // this.notes.sort((a, b) => a[0] - b[1])
    }

    getNoteCount() {
        return this.notes.length;
    }

    getNotes() {
        return this.notes;
    }
}
