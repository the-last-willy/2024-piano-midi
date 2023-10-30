"use strict";

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
        if (this.interval === null)
            this.interval = setInterval(() => this.clearStave(), 10 * 1e3);

        let toNote = (x) => x[0] + '/' + x[1];

        let tickCtx = new TickContext();
        let note = new StaveNote({
            clef: 'treble',
            keys: [toNote(key)],
            duration: 4
        });
        let x = (Date.now() - this.firstTime) / 1e3 * 100;
        note.setStave(this.trebleStaves[0]);
        tickCtx.addTickable(note);
        tickCtx.preFormat().setX(x);
        let g = this.ctx.openGroup()
        note.draw();
        this.ctx.closeGroup()
        this.noteGroups.push(g)
    }

    renderSequence(seq) {
        let stavecount = Math.ceil(seq.getDuration() / (4 / 120))

        let trebleClefs = [];

        for (let i = 0; i < stavecount; ++i) {
            let x = 0;
            if (trebleClefs.length > 0)
                x = trebleClefs.at(-1).getNoteEndX();
            let trebleClef = new Stave(x, 50, 200);
            trebleClefs.push(trebleClef);
            if (i == 0) {
                trebleClef
                    .addClef('treble')
                    .setTimeSignature("4/4");
                trebleClef.format()
                trebleClef.setWidth(trebleClef.getWidth() + trebleClef.getNoteStartX())
            }
            trebleClef.setContext(this.ctx).draw();
        }

        let trebleClef = trebleClefs[0];

        let bassclefs = [];

        for (let i = 0; i < stavecount; ++i) {
            let x = 0;
            if (bassclefs.length > 0)
                x = bassclefs.at(-1).getNoteEndX();
            let bassclef = new Stave(x, 110, 200);
            bassclefs.push(bassclef);
            if (i == 0) {
                bassclef
                    .addClef('bass')
                    .setTimeSignature("4/4");
                bassclef.format()
                bassclef.setWidth(bassclef.getWidth() + bassclef.getNoteStartX())
            }
            bassclef.setContext(this.ctx).draw();
        }

        let bassclef = bassclefs.at(-1);

        // drawBarLine(this.ctx, bassClef.getNoteStartX(), 0, 200)
        // drawBarLine(this.ctx, bassClef.getNoteEndX(), 0, 200)

        for (let [time, note] of seq.getNotes()) {
            let stemAlign = 20; // I don't know, otherwise the stems are not on x.
            let x = time * 120 * 50 + 25 - stemAlign;

            // drawBarLine(this.ctx, bassClef.getNoteStartX() + x + stemAlign, 50, 150)
            console.log(note)

            let tickCtx = new TickContext();
            let stavenote = new StaveNote({
                clef: 'treble',
                keys: [note.pitch + "/" + note.octave],
                duration: 4
            });
            stavenote.setStave(trebleClef);
            tickCtx.addTickable(stavenote);
            tickCtx.preFormat().setX(x);
            stavenote.draw();
        }
    }
}
