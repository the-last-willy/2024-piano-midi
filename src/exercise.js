export const c_major_scale = () => [
    'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4',
    'C4'
]

export class Exercise extends EventTarget {
    constructor(notes) {
        super()
        this.remaining_notes = notes
    }

    get expected_note() {
        return this.remaining_notes[0]
    }

    play(note) {
        if(this.remaining_notes.length > 0)
        {
            if(note === this.expected_note) {
                this.dispatchEvent(new CustomEvent('playcorrectnote'))
                this.remaining_notes.shift()
                if(this.remaining_notes.length === 0) {
                    this.dispatchEvent(new CustomEvent('finish'))
                }
            } else {
                this.dispatchEvent(new CustomEvent('playincorrectnote'))
            }
        }
    }
}
