import { Component } from 'ape-ecs'

export class FrameInfoComponent extends Component {
	static typeName = 'FrameInfo'

	static properties = {
		elapsedS: 0,
		elapsedMs: 0,
		totalS: 0,
		totalMs: 0,
	}
}
