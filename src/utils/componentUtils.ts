import { Component, IComponentConfig } from 'ape-ecs'

export type ConstructorConstraint = (new () => Component) & {
	properties: Object
}

export type TypedComponent<TConstructor extends ConstructorConstraint> =
	Component & TConstructor['properties']

export function createComponent<
	TConstructor extends ConstructorConstraint & { typeName: string }
>(
	type: TConstructor,
	properties?: Partial<TConstructor['properties']> &
		Omit<IComponentConfig, 'type'>
): IComponentConfig {
	return {
		type: type.typeName,
		...properties,
	}
}
