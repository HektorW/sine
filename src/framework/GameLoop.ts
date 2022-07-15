import { Time } from './Time'

export class GameLoop {
	#time: Time = new Time()
	#rafId = 0

	#onUpdateCallback: (time: Time) => void

	constructor(onUpdateCallback: (time: Time) => void) {
		this.#onUpdateCallback = onUpdateCallback
	}

	start() {
		cancelAnimationFrame(this.#rafId)
		this.#rafId = requestAnimationFrame(this.#onRafFrame)
		this.#time.resetLastNow()
	}

	stop() {
		cancelAnimationFrame(this.#rafId)
	}

	#onRafFrame = () => {
		this.#rafId = requestAnimationFrame(this.#onRafFrame)

		this.#time.tick()

		this.#onUpdateCallback(this.#time)
	}
}
