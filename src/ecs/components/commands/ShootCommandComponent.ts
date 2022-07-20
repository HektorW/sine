import { Component } from 'ape-ecs'
import { Vector } from 'matter-js'
import { BaseInputCommandProperties } from './BaseInputCommand'

export class ShootCommandComponent extends Component {
	static typeName = 'shoot-command'

	static properties: BaseInputCommandProperties = {
		inputVector: Vector.create(0, 0),
	}
}
