import { Vector } from 'matter-js'

type TouchJoystickConstructorArgs = {
	radius: number
	position: Vector
}

export class TouchJoystick {
	#radius: number
	#position: Vector

	constructor({ radius, position }: TouchJoystickConstructorArgs) {
		this.#radius = radius
		this.#position = Vector.clone(position)
	}
}
