import { Component } from 'ape-ecs'

export class MoveableComponent extends Component {
	static typeName = 'moveable'

	static properties = {
		speed: 0,
	}
}
