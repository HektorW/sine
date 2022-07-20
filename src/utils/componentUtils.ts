import { Component, IComponentConfig } from 'ape-ecs'

export type ComponentConstructor<TProperties = Object> = (new () => Component) & {
	typeName: string
	properties: TProperties
}

export type ComponentInstance<TConstructor extends ComponentConstructor> = Component &
	TConstructor['properties']

export function createComponent<TConstructor extends ComponentConstructor & { typeName: string }>(
	type: TConstructor,
	properties?: Partial<TConstructor['properties']> & Omit<IComponentConfig, 'type'>
): IComponentConfig {
	return {
		type: type.typeName,
		...properties,
	}
}
