"use strict";

const {Factory, EasyScore, Stave, StaveNote, StaveTempo, System, TickContext} = Vex.Flow;

export class Renderer {
    trebleStaves = [];

    constructor() {
        const vf = new Factory({
            renderer: {elementId: 'output', width: 1000, height: 300},
        });

        this.ctx = vf.getContext();

        let staveX = 0
        for(let i = 0; i < 4; ++i) {
            let stave = new Stave(staveX, 50, 200)
            this.trebleStaves.push(stave)

            if(i === 0) {
                stave
                    .addClef('treble')
                    .setTimeSignature("4/4");
                stave.format();
                stave.setWidth(stave.getWidth() + stave.getNoteStartX());
                staveX += stave.getNoteStartX();
            }
            
            stave.setContext(this.ctx).draw();

            staveX += 200;
        }

        this.bassStave = new Stave(0, 110, 800)
            .addClef('bass')
            .setTimeSignature("4/4");
        this.bassStave.setContext(this.ctx).draw();

        this.noteGroups = []

        this.firstTime = null;

        this.interval = null

        this.tempo = new StaveTempo({bpm: 120, duration: 'q'}, 0, 0);
        this.tempo.draw(this.trebleStaves[0], 0);
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
}
