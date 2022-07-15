export class Time {
	#lastNow = 0

	elapsedS = 0
	elapsedMs = 0
	totalS = 0
	totalMs = 0

	resetLastNow() {
		this.#lastNow = performance.now()
	}

	tick() {
		const now = performance.now()

		this.elapsedMs = now - this.#lastNow
		this.elapsedS = this.elapsedMs / 1000

		this.totalMs += this.elapsedMs
		this.totalS += this.elapsedS

		this.#lastNow = now
	}
}
