import * as midi from "./midi.js";

test.each([
    [[0b10000000, 0b00000000, 0b00000000], 0],
    [[0b10001111, 0b00000000, 0b00000000], 15],
    [[0b10011111, 0b01111111, 0b00000000], 15]
])('midi event (%s) channel is %s', (data, channel) => {
    let e = new midi.MidiEvent(data)
    expect(e.channel).toBe(channel)
});

test('midi event has a type', () => {
    let e = new midi.MidiEvent([0b10001111, 0b00000000, 0b00000000])
    expect(e.type).toBe(8)
});

test('key off event is named', () => {
    let e = new midi.MidiEvent([0b10001111, 0b00000000, 0b00000000])
    expect(e.name).toBe('KeyOffEvent')
})

test('key on event is named', () => {
    let e = new midi.MidiEvent([0b10011111, 0b00000000, 0b00000000])
    expect(e.name).toBe('KeyOnEvent')
})

test.each([
    [[0b10011111, 0b00000000, 0b00000000], 0],
    [[0b10011111, 0b01111111, 0b00000000], 127]
])
('key on event (%s) key is %s', (data, key) => {
    let e = new midi.MidiEvent(data)
    expect(e.key).toBe(key)
})

test.each([
    [[0b10011111, 0b00000000, 0b00000000], 0],
    [[0b10011111, 0b00000000, 0b01111111], 127]
])
('key on event (%s) velocity is %s', (data, velocity) => {
    let e = new midi.MidiEvent(data)
    expect(e.velocity).toBe(velocity)
})

test('MidiEvent is convertible to string', () => {
    let e = new midi.MidiEvent([0b10011111, 0b00000000, 0b01111111])
    expect(typeof e.toString()).toBe('string')
})
