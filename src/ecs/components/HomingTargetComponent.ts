import { Component, Entity, EntityRef } from 'ape-ecs'
import { ComponentInstance } from '../../utils/componentUtils'

export type HomingTargetComponentConstructor = typeof HomingTargetComponent
export type HomingTargetComponentInstance = ComponentInstance<HomingTargetComponentConstructor>

export type HomingTargetComponentProperties = {
	targetTag: string | null
	targetEntity: Entity | null
}

export class HomingTargetComponent extends Component {
	static typeName = 'HomingTarget'

	static properties: HomingTargetComponentProperties = {
		targetTag: null,
		// @ts-ignore: ape-ecs will set the type to a correct one
		targetEntity: EntityRef,
	}
}
