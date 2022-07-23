import { System } from 'ape-ecs'
import { componentKeyFrameInfo, componentKeyGlobals } from '../../constants/componentKeys'
import { entityIdFrameInfo, entityIdGlobals } from '../../constants/entityIds'
import { getComponentById } from '../../utils/entityUtils'
import {
	FrameInfoComponentInstance,
	FrameInfoComponentType,
} from '../components/FrameInfoComponent'
import {
	GlobalsComponentConstructor,
	GlobalsComponentInstance,
} from '../components/GlobalsComponent'

export class BaseSystem extends System {
	#frameInfo: FrameInfoComponentInstance | null = null
	#globals: GlobalsComponentInstance | null = null

	getFrameInfo(): FrameInfoComponentInstance {
		if (!this.#frameInfo) {
			this.#frameInfo = getComponentById<FrameInfoComponentType>(
				this.world.getEntity(entityIdFrameInfo)!,
				componentKeyFrameInfo
			)!
		}

		return this.#frameInfo!
	}

	getGlobals(): GlobalsComponentInstance {
		if (!this.#globals) {
			this.#globals = getComponentById<GlobalsComponentConstructor>(
				this.world.getEntity(entityIdGlobals)!,
				componentKeyGlobals
			)!
		}
		return this.#globals!
	}
}
