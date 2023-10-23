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
                    // TODO: Time isn't the piano responsibility !
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
                    // TODO: Time isn't the piano responsibility !
                    time: Date.now(),
                }
            }
        ))
    }
}
