import { Query, World } from 'ape-ecs'
import { getTypedComponents, getTypedOne } from '../../utils/entityUtils'
import { MoveableComponent } from '../components/MoveableComponent'
import { TransformComponent } from '../components/TransformComponent'
import { MoveCommandComponent } from '../components/commands/MoveCommandComponent'
import { BaseSystem } from './BaseSystem'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { Body, Vector } from 'matter-js'

export class MoveSystem extends BaseSystem {
	declare transformMoveQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.transformMoveQuery = this.createQuery()
			.fromAll(MoveableComponent, MoveCommandComponent)
			.persist()
	}

	update() {
		const frameInfo = this.getFrameInfo()

		for (const entity of this.transformMoveQuery.execute()) {
			for (const moveable of getTypedComponents(entity, MoveableComponent)) {
				for (const moveCommand of getTypedComponents(entity, MoveCommandComponent)) {
					if (entity.has(RigidBodyComponent)) {
						const rigidBody = getTypedOne(entity, RigidBodyComponent)!

						Body.setVelocity(
							rigidBody.body,
							Vector.mult(moveCommand.inputVector, moveable.speed * frameInfo.elapsedS)
						)

						rigidBody.update()
					} else if (entity.has(TransformComponent)) {
						const transform = getTypedOne(entity, TransformComponent)!

						transform.x += frameInfo.elapsedS * moveCommand.inputVector.x * moveable.speed
						transform.y += frameInfo.elapsedS * moveCommand.inputVector.y * moveable.speed

						transform.update()
					}

					if (!moveCommand.recurring) {
						entity.removeComponent(moveCommand)
					}
				}
			}
		}
	}
}
