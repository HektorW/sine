import { Component } from 'ape-ecs'
import { Vector } from 'matter-js'

export class MoveComponent extends Component {
	static typeName = 'Move'

	static properties = {
		direction: Vector.create(0, 0),
		speed: 0,
	}
}
