import * as ex from './exercise.js'

test('an exercise is made of notes', () => {
    let e = new ex.Exercise(ex.c_major_scale())
    expect(e.remaining_notes).toStrictEqual(ex.c_major_scale())
})

test('an exercise expects a note', () => {
    let e = new ex.Exercise(ex.c_major_scale())
    expect(e.expected_note).toStrictEqual('C4')
})

test('an exercise expects a new note when playing the expected note', () => {
    let e = new ex.Exercise(ex.c_major_scale())
    e.play('C4')
    expect(e.expected_note).toStrictEqual('D4')
})

test('an exercise expects the same note when playing the wrong note', () => {
    let e = new ex.Exercise(ex.c_major_scale())
    e.play('D4')
    expect(e.expected_note).toStrictEqual('C4')
})

test('exercise dispatches playcorrectnote when a correct note is played', () => {
    let e = new ex.Exercise(ex.c_major_scale())
    let eventTriggered = false
    e.addEventListener('playcorrectnote', () => { eventTriggered = true })
    e.play('C4')
    expect(eventTriggered).toStrictEqual(true)
})

test('exercise dispatches playincorrectnote when an incorrect note is played', () => {
    let e = new ex.Exercise(ex.c_major_scale())
    let eventTriggered = false
    e.addEventListener('playincorrectnote', () => { eventTriggered = true })
    e.play('D4')
    expect(eventTriggered).toStrictEqual(true)
})

test('exercise dispatches `finish` event when all notes played', () => {
    let e = new ex.Exercise(['C4'])
    let eventTriggered = false
    e.addEventListener('finish', () => { eventTriggered = true })
    e.play('C4')
    expect(eventTriggered).toStrictEqual(true)
})

test('exercise dispatches nothing when a note is played but there\'s no remaining not', () => {
    let e = new ex.Exercise([])
    let fail = () => expect(true).toBe(false)
    e.addEventListener('playcorrectnote', fail)
    e.addEventListener('playincorrectnote', fail)
    e.addEventListener('finish', fail)
    e.play('C4')
})