import { Component } from 'ape-ecs'
import { ComponentInstance } from '../../utils/componentUtils'

export type FrameInfoComponentType = typeof FrameInfoComponent
export type FrameInfoComponentInstance = ComponentInstance<FrameInfoComponentType>

export class FrameInfoComponent extends Component {
	static typeName = 'FrameInfo'

	static properties = {
		elapsedS: 0,
		elapsedMs: 0,
		totalS: 0,
		totalMs: 0,
	}
}
