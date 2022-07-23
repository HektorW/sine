import { Component, Entity, EntityRef } from 'ape-ecs'
import { ComponentInstance } from '../../utils/componentUtils'

export type DamageComponentConstructor = typeof DamageComponent
export type DamageComponentInstance = ComponentInstance<DamageComponentConstructor>

export type DamageComponentProperties = {
	damage: number
	sourceEntity: Entity | null
}

export class DamageComponent extends Component {
	static typeName = 'Damage'

	static properties: DamageComponentProperties = {
		damage: 0,
		// @ts-ignore: ape-ecs will set the type to a correct one
		sourceEntity: EntityRef,
	}
}
