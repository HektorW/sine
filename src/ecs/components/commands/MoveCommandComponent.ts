import { Component } from 'ape-ecs'
import { Vector } from 'matter-js'
import { BaseInputCommandProperties } from './BaseInputCommand'

export type MoveCommandProperties = BaseInputCommandProperties & {
	recurring?: boolean
}

export class MoveCommandComponent extends Component {
	static typeName = 'move-command'

	static properties: MoveCommandProperties = {
		inputVector: Vector.create(0, 0),
		recurring: false,
	}
}
