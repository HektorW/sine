export enum KeyboardKey {
	A = 'a',
	D = 'd',
	S = 's',
	W = 'w',
}

export class KeyboardState {
	#keysDown: Partial<Record<KeyboardKey, boolean>> = {}
	#keysDownLast: Partial<Record<KeyboardKey, boolean>> = {}

	constructor() {
		window.addEventListener('keydown', this.#onKeyDown)
		window.addEventListener('keyup', this.#onKeyUp)
	}

	isKeyDown = (key: KeyboardKey) => {
		return this.#keysDown[key] === true
	}

	isKeyClicked = (key: KeyboardKey) => {
		return !this.isKeyDown(key) && this.#keysDownLast[key] === true
	}

	update = () => {
		this.#keysDownLast = { ...this.#keysDown }
	}

	#onKeyDown = (event: KeyboardEvent) => {
		this.#keysDown[event.key.toLowerCase() as KeyboardKey] = true
	}

	#onKeyUp = (event: KeyboardEvent) => {
		this.#keysDown[event.key.toLowerCase() as KeyboardKey] = false
	}
}
