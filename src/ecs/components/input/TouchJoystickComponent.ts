import { Component } from 'ape-ecs'
import { Vector } from 'matter-js'
import { ComponentInstance } from '../../../utils/componentUtils'
import { BaseInputCommand } from '../commands/BaseInputCommand'

export type TouchJoystickProperties = {
	center: Vector
	radius: number
	commands: BaseInputCommand[]

	_activeTouchIdentifier: Touch['identifier'] | null
	_activeInputVector: Vector | null
}

export type TouchJoystickComponentInstance = ComponentInstance<typeof TouchJoystickComponent>

export const touchJoystickSpriteBackgroundKey = 'touchJoystickBg'
export const touchJoystickSpriteIndicatorKey = 'touchJoystickIndicator'

export class TouchJoystickComponent extends Component {
	static typeName = 'touch-joystick'

	static properties: TouchJoystickProperties = {
		center: Vector.create(),
		radius: 100,
		commands: [],

		_activeTouchIdentifier: null,
		_activeInputVector: null,
	}
}
