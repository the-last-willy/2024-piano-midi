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
    [60, 'C4'],
    [62, 'D4'],
    [64, 'E4'],
    [65, 'F4'],
    [67, 'G4'],
    [69, 'A4'],
    [71, 'B4'],
    [60 + 12, 'C5'],
])
