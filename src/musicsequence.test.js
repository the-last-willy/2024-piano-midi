import {Note, MusicSequence} from './musicsequence.js'

test("Sheet music has 4/4 time signature", () => {
    let sheet = new MusicSequence()
    expect(sheet.getTimeSignature()).toEqual([4, 4])
})

test("Sheet music has tempo", () => {
    let sheet = new MusicSequence()
    expect(sheet.getTempo()).toEqual(120)
})

test("Sheet music can have notes", () => {
    let sheet = new MusicSequence();
    sheet.addNote(1, new Note());
    expect(sheet.getNoteCount()).toEqual(1);
    expect(sheet.getNotes()[0]).toEqual([1, new Note()]);
})

test("Sheet music has duraction", () => {
    let sheet = new MusicSequence();
    sheet.addNote(1, new Note());
    expect(sheet.getDuration()).toEqual(1 + 1 / 120)
})

test("Sheet music notes are sorted by time", () => {
    let sheet = new MusicSequence();
    sheet.addNote()
})

test("Empty sheet music has duration of 0 seconds", () => {
    let sheet = new MusicSequence()
    expect(sheet.getDuration()).toEqual(0)
})
