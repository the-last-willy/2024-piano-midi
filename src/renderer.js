"use strict";

const {Factory, EasyScore, Stave, StaveNote, System, TickContext} = Vex.Flow;

export class Renderer {
    constructor() {
        const vf = new Factory({
            renderer: {elementId: 'output', width: 1000, height: 300},
        });

        this.ctx = vf.getContext();

        this.trebleStave = new Stave(0, 50, 900).addClef('treble');
        this.trebleStave.setContext(this.ctx).draw();

        this.bassStave = new Stave(0, 110, 900).addClef('bass');
        this.bassStave.setContext(this.ctx).draw();

        this.noteGroups = []

        this.firstTime = null;



        this.interval = null
    }

    clearStave() {
        for(let g of this.noteGroups) {
            g.remove();
        }
        this.noteGroups = []
        this.firstTime = null;
    }

    press(key) {
        if(this.firstTime === null)
            this.firstTime = Date.now();
        if(this.interval === null)
            this.interval = setInterval(() => this.clearStave(), 10 * 1e3);

        let toNote = (x) => x[0] + '/' + x[1];

        let tickCtx = new TickContext();
        let note = new StaveNote({
            clef: 'treble',
            keys: [toNote(key)],
            duration: 4
        });
        let x = (Date.now() - this.firstTime) / 1e3 * 100;
        note.setContext(this.ctx).setStave(this.trebleStave);
        tickCtx.addTickable(note);
        tickCtx.preFormat().setX(x);
        let g = this.ctx.openGroup()
        note.draw();
        this.ctx.closeGroup()
        this.noteGroups.push(g)
    }
}
