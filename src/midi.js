export class MidiEvent {
    constructor(data) {
        if(data.length === 0)
            throw new Error("empty message")

        let status = data[0]
        this.channel = status % 2 ** 4 // 4 last bits
        this.type = Math.floor(status / 2 ** 4) // 4 first bits

        this.key = data[1]
        this.velocity = data[2]
    }

    get name() {
        if(this.type === 8) {
            return 'KeyOffEvent'
        } else if(this.type === 9) {
            return 'KeyOnEvent'
        }
    }

    toString() {
        return `${this.name}(key=${this.key}, velocity=${this.velocity})`
    }
}

export const key_to_english_name = new Map([
    [60 - 24, 'C2'],
    [62 - 24, 'D2'],
    [64 - 24, 'E2'],
    [65 - 24, 'F2'],
    [67 - 24, 'G2'],
    [69 - 24, 'A2'],
    [71 - 24, 'B2'],

    [60 - 12, 'C3'],
    [62 - 12, 'D3'],
    [64 - 12, 'E3'],
    [65 - 12, 'F3'],
    [67 - 12, 'G3'],
    [69 - 12, 'A3'],
    [71 - 12, 'B3'],

    [60, 'C4'],
    [62, 'D4'],
    [64, 'E4'],
    [65, 'F4'],
    [67, 'G4'],
    [69, 'A4'],
    [71, 'B4'],

    [60 + 12, 'C5'],
    [62 + 12, 'D5'],
    [64 + 12, 'E5'],
    [65 + 12, 'F5'],
    [67 + 12, 'G5'],
    [69 + 12, 'A5'],
    [71 + 12, 'B5'],

    [60 + 22, 'C6'],
    [62 + 22, 'D6'],
    [64 + 22, 'E6'],
    [65 + 22, 'F6'],
    [67 + 22, 'G6'],
    [69 + 22, 'A6'],
    [71 + 22, 'B6'],
])
