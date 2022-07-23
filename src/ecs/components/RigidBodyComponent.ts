import { Component } from 'ape-ecs'
import { Bodies, Body } from 'matter-js'
import { ComponentInstance } from '../../utils/componentUtils'

export type RigidBodyComponentConstructor = typeof RigidBodyComponent
export type RigidBodyComponentInstance = ComponentInstance<RigidBodyComponentConstructor>

export type RigidBodyComponentProperties = {
	body: Body
}

export class RigidBodyComponent extends Component {
	static typeName = 'rigid-body'

	static properties: RigidBodyComponentProperties = {
		body: Bodies.rectangle(0, 0, 0, 0),
	}
}
