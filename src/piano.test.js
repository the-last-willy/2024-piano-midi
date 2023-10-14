import {Piano} from './piano.js'

test('a piano presses a key', () => {
    let p = new Piano()

    let pressednote = null
    p.addEventListener("keypress", (e) => {
        pressednote = e.detail.note
    })

    p.press('C4')

    expect(pressednote).toEqual('C4')
})

test('a piano releases a key', () => {
    let p = new Piano()

    let releasednote = null
    p.addEventListener("keyrelease", (e) => {
        releasednote = e.detail.note
    })

    p.release('C5')

    expect(releasednote).toEqual('C5')
})

test('a piano presses a key at the current time', () => {
    let p = new Piano()

    let time = null
    p.addEventListener("keypress", (e) => {
        time = e.detail.time
    })

    let before = Date.now()
    p.press('C4')
    let after = Date.now()

    expect(time).toBeGreaterThanOrEqual(before)
    expect(time).toBeLessThanOrEqual(after)
})

test('a piano releases a key at the current time', () => {
    let p = new Piano()

    let time = null
    p.addEventListener("keyrelease", (e) => {
        time = e.detail.time
    })

    let before = Date.now()
    p.release('C4')
    let after = Date.now()

    expect(time).toBeGreaterThanOrEqual(before)
    expect(time).toBeLessThanOrEqual(after)
})
