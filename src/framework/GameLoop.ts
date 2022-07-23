import { Time } from './Time'

export class GameLoop {
	#time: Time = new Time()
	#rafId = 0
	#pausedThroughVisibilityChange = false

	#onUpdateCallback: (time: Time) => void

	constructor(onUpdateCallback: (time: Time) => void) {
		this.#onUpdateCallback = onUpdateCallback

		document.addEventListener('visibilitychange', this.#onVisibilityChange)
	}

	start() {
		cancelAnimationFrame(this.#rafId)
		this.#rafId = requestAnimationFrame(this.#onRafFrame)
		this.#time.resetLastNow()
	}

	pause() {
		this.#pausedThroughVisibilityChange = false
		cancelAnimationFrame(this.#rafId)
	}

	#onRafFrame = () => {
		this.#rafId = requestAnimationFrame(this.#onRafFrame)

		this.#time.tick()

		this.#onUpdateCallback(this.#time)
	}

	#onVisibilityChange = () => {
		if (document.visibilityState === 'hidden') {
			this.pause()
			this.#pausedThroughVisibilityChange = true
		}

		if (document.visibilityState === 'visible') {
			if (this.#pausedThroughVisibilityChange) {
				this.start()
				this.#pausedThroughVisibilityChange = false
			}
		}
	}
}
