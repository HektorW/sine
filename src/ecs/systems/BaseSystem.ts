import { System } from 'ape-ecs'
import { getComponentById } from '../../utils/entityUtils'
import {
	FrameInfoComponentInstance,
	FrameInfoComponentType,
} from '../components/FrameInfoComponent'

export class BaseSystem extends System {
	#frameInfo: FrameInfoComponentInstance | null = null

	getFrameInfo(): FrameInfoComponentInstance {
		if (!this.#frameInfo) {
			this.#frameInfo = getComponentById<FrameInfoComponentType>(
				this.world.getEntity('frame-info')!,
				'time'
			)!
		}

		return this.#frameInfo!
	}
}
