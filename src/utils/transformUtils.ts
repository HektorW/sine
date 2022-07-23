import { Entity } from 'ape-ecs'
import { Vector } from 'matter-js'
import { RigidBodyComponent } from '../ecs/components/RigidBodyComponent'
import { TransformComponent } from '../ecs/components/TransformComponent'
import { getTypedOne } from './entityUtils'

export function getEntityCenter(entity: Entity): Vector {
	const center = Vector.create(0, 0)

	if (entity.has(RigidBodyComponent)) {
		const rigidBody = getTypedOne(entity, RigidBodyComponent)!
		center.x = rigidBody.body.position.x
		center.y = rigidBody.body.position.y
	} else if (entity.has(TransformComponent)) {
		const transform = getTypedOne(entity, TransformComponent)!
		center.x = transform.x
		center.y = transform.y
	}

	return center
}
