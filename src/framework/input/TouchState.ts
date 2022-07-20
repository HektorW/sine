export type TouchMap = Map<Touch['identifier'], Touch>

export class TouchState {
	constructor(container: (Window & typeof globalThis) | HTMLElement = window) {
		const typedContainer = container as HTMLElement

		typedContainer.addEventListener('touchstart', this.#onTouchStart, { passive: false })
		typedContainer.addEventListener('touchmove', this.#onTouchMove, { passive: false })
		typedContainer.addEventListener('touchcancel', this.#onTouchCancel, { passive: false })
		typedContainer.addEventListener('touchend', this.#onTouchEnd, { passive: false })
	}

	getTouches = () => {
		return this.#touches
	}

	getTouch = (identifier: Touch['identifier']) => {
		return this.#touches.get(identifier) ?? null
	}

	#touches: TouchMap = new Map()

	#onTouchStart = (event: TouchEvent) => {
		event.preventDefault()
		this.#addTouches(event.changedTouches)
	}

	#onTouchMove = (event: TouchEvent) => {
		event.preventDefault()
		this.#updateTouches(event.changedTouches)
	}

	#onTouchCancel = (event: TouchEvent) => {
		event.preventDefault()
		this.#removeTouches(event.changedTouches)
	}

	#onTouchEnd = (event: TouchEvent) => {
		event.preventDefault()
		this.#removeTouches(event.changedTouches)
	}

	#addTouches = (touchList: TouchList) => {
		for (let touchIndex = 0; touchIndex < touchList.length; touchIndex++) {
			const touch = touchList[touchIndex]
			this.#touches.set(touch.identifier, touch)
		}
	}

	#updateTouches = (touchList: TouchList) => {
		for (let touchIndex = 0; touchIndex < touchList.length; touchIndex++) {
			const touch = touchList[touchIndex]
			this.#touches.set(touch.identifier, touch)
		}
	}

	#removeTouches = (touchList: TouchList) => {
		for (let touchIndex = 0; touchIndex < touchList.length; touchIndex++) {
			const touch = touchList[touchIndex]
			this.#touches.delete(touch.identifier)
		}
	}
}
