import { Component } from 'ape-ecs'
import { Engine } from 'matter-js'
import { ComponentInstance } from '../../utils/componentUtils'

export type GlobalsComponentConstructor = typeof GlobalsComponent
export type GlobalsComponentInstance = ComponentInstance<GlobalsComponentConstructor>

export type GlobalsComponentProperties = {
	engine: Engine
}

export class GlobalsComponent extends Component {
	static typeName = 'globals'

	static properties: GlobalsComponentProperties = {
		engine: Engine.create(),
	}
}
