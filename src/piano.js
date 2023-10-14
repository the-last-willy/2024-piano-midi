export class Piano extends EventTarget {
    constructor() {
        super()
    }

    press(note) {
        this.dispatchEvent(new CustomEvent(
            "keypress",
            {
                detail: {
                    note,
                    time: Date.now(),
                }
            }
        ))
    }

    release(note) {
        this.dispatchEvent(new CustomEvent(
            "keyrelease",
            {
                detail: {
                    note,
                    time: Date.now(),
                }
            }
        ))
    }
}
