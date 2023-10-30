"use strict";

import {Note} from "./musicsequence.js";

const {Factory, EasyScore, Stave, StaveNote, StaveTempo, System, TickContext} = Vex.Flow;

function drawBarLine(ctx, x, y0, y1) {
    let group = ctx.openGroup();
    ctx.fillRect(x, y0, 1, y1 - y0);
    ctx.closeGroup();
    return group;
}

export class Renderer {
    cursor = null;
    bassStaves = [];
    trebleStaves = [];

    constructor() {
        const vf = new Factory({
            renderer: {elementId: 'output', width: 1000, height: 300},
        });

        this.ctx = vf.getContext();

        // this.cursor = drawBarLine(this.ctx, 50, 50, 300);

        let staveX = 0
        for (let i = 0; i < 4; ++i) {
            let stave = new Stave(staveX, 50, 200)
            this.trebleStaves.push(stave)

            if (i === 0) {
                stave
                    .addClef('treble')
                    .setTimeSignature("4/4");
                stave.format();
                stave.setWidth(stave.getWidth() + stave.getNoteStartX());
                staveX += stave.getNoteStartX();
            }

            // stave.setContext(this.ctx).draw();

            staveX += 200;
        }

        this.bassStave = new Stave(0, 110, 800)
            .addClef('bass')
            .setTimeSignature("4/4");
        // this.bassStave.setContext(this.ctx).draw();

        this.noteGroups = []

        this.firstTime = null;

        this.interval = null

        this.tempo = new StaveTempo({bpm: 120, duration: 'q'}, 0, 0);
        // this.tempo.draw(this.trebleStaves[0], 0);
    }

    clearStave() {
        for (let g of this.noteGroups) {
            g.remove();
        }
        this.noteGroups = []
        this.firstTime = null;
    }

    press(key) {
        if (this.firstTime === null)
            this.firstTime = Date.now();
        // if (this.interval === null)
        //     this.interval = setInterval(() => this.clearStave(), 10 * 1e3);

        let time = (Date.now() - this.firstTime) / 1e3;

        let g = this.ctx.openGroup()
        let note = new Note();
        note.pitch = key[0];
        note.octave = key[1];
        console.log(time, note)
        this.drawNote(time, note);
        this.ctx.closeGroup()
        this.noteGroups.push(g)
    }

    drawSequenceStaves(seq) {
        let stavecount = Math.ceil(seq.getDuration() / (4 * 60 / 120))

        this.trebleClefs = [];

        for (let i = 0; i < stavecount; ++i) {
            let x = 0;
            if (this.trebleClefs.length > 0)
                x = this.trebleClefs.at(-1).getNoteEndX();
            let trebleClef = new Stave(x, 50, 200);
            this.trebleClefs.push(trebleClef);
            if (i === 0) {
                trebleClef
                    .addClef('treble')
                    .setTimeSignature("4/4");
                trebleClef.format()
                trebleClef.setWidth(trebleClef.getWidth() + trebleClef.getNoteStartX())
            }
            trebleClef.setContext(this.ctx).draw();
        }

        this.bassclefs = [];

        for (let i = 0; i < stavecount; ++i) {
            let x = 0;
            if (this.bassclefs.length > 0)
                x = this.bassclefs.at(-1).getNoteEndX();
            let bassclef = new Stave(x, 110, 200);
            this.bassclefs.push(bassclef);
            if (i === 0) {
                bassclef
                    .addClef('bass')
                    .setTimeSignature("4/4");
                bassclef.format()
                bassclef.setWidth(bassclef.getWidth() + bassclef.getNoteStartX())
            }
            bassclef.setContext(this.ctx).draw();
        }
    }

    drawNote(time, note, color="black") {
        let stemAlign = 20; // I don't know, otherwise the stems are not on x.
        let x = time * 120/60 * 50 + 25 - stemAlign;

        let tickCtx = new TickContext();
        let stavenote = new StaveNote({
            clef: 'treble',
            keys: [note.pitch + "/" + note.octave],
            duration: 4
        });
        stavenote.setStyle({fillStyle: color, strokeStyle: color})
        stavenote.setStave(this.trebleClefs[0]);
        tickCtx.addTickable(stavenote);
        tickCtx.preFormat().setX(x);
        stavenote.draw();
    }

    drawSequenceNotes(seq) {
        for (let [time, note] of seq.getNotes())
            this.drawNote(time, note, "grey")
    }

    renderSequence(seq) {
        this.drawSequenceStaves(seq);
        this.drawSequenceNotes(seq);
    }
}
