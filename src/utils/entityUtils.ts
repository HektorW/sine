import type { Entity } from 'ape-ecs'
import type { ComponentConstructor, ComponentInstance } from './componentUtils'

export function getTypedComponents<TConstructor extends ComponentConstructor>(
	entity: Entity,
	type: TConstructor
): Set<ComponentInstance<TConstructor>> {
	return entity.getComponents(type)
}

export function getTypedOne<TConstructor extends ComponentConstructor>(
	entity: Entity,
	type: TConstructor
): ComponentInstance<TConstructor> | null {
	return entity.getOne(type) ?? null
}

export function getComponentById<TConstructor extends ComponentConstructor>(
	entity: Entity,
	componentId: string
): ComponentInstance<TConstructor> | null {
	return entity.c[componentId] ?? null
}
