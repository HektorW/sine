import type { Entity } from 'ape-ecs'
import type { ConstructorConstraint, TypedComponent } from './componentUtils'

export function getTypedComponents<TConstructor extends ConstructorConstraint>(
	entity: Entity,
	type: TConstructor
) {
	return entity.getComponents(type) as unknown as Set<
		TypedComponent<TConstructor>
	>
}

export function getComponentById<TConstructor extends ConstructorConstraint>(
	entity: Entity,
	componentId: string
) {
	return entity.c[componentId] as TypedComponent<TConstructor>
}
