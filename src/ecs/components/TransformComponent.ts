import { Component } from 'ape-ecs'

export class TransformComponent extends Component {
	static typeName = 'Transform'

	static properties = {
		x: 0,
		y: 0,
		angle: 0,
	}
}
