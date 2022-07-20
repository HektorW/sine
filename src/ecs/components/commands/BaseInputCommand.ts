import { Entity } from 'ape-ecs'
import { Vector } from 'matter-js'
import { ComponentConstructor } from '../../../utils/componentUtils'

export type BaseInputCommandProperties = {
	inputVector: Vector
}

export type BaseInputCommandComponentConstructor = ComponentConstructor<BaseInputCommandProperties>

export type BaseInputCommand = {
	component: BaseInputCommandComponentConstructor
	entity?: Entity
}
