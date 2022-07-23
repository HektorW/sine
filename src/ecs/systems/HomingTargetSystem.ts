import { Query, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { createComponent } from '../../utils/componentUtils'
import { getTypedOne } from '../../utils/entityUtils'
import { getEntityCenter } from '../../utils/transformUtils'
import { MoveCommandComponent } from '../components/commands/MoveCommandComponent'
import { HomingTargetComponent } from '../components/HomingTargetComponent'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { BaseSystem } from './BaseSystem'

export class HomingTargetSystem extends BaseSystem {
	#homingTargetsQuery: Query

	constructor(world: World) {
		super(world)

		this.#homingTargetsQuery = this.createQuery().fromAll(HomingTargetComponent).persist()
	}

	update() {
		for (const entity of this.#homingTargetsQuery.execute()) {
			const homingTarget = getTypedOne(entity, HomingTargetComponent)
			if (!homingTarget) {
				continue
			}

			const rigidBody = getTypedOne(entity, RigidBodyComponent)
			if (!rigidBody) {
				continue
			}
			const entityCenter = rigidBody.body.position

			let targetEntity = homingTarget.targetEntity
			if (!targetEntity) {
				if (homingTarget.targetTag) {
					let closestMagnituteSquared = Infinity

					const tagQuery = this.createQuery().fromAll(homingTarget.targetTag)
					for (const potentialTargetEntity of tagQuery.execute()) {
						if (!targetEntity) {
							targetEntity = potentialTargetEntity
							closestMagnituteSquared = Vector.magnitudeSquared(
								Vector.sub(entityCenter, getEntityCenter(targetEntity))
							)
							continue
						}

						const magnitudeSquared = Vector.magnitudeSquared(
							Vector.sub(entityCenter, getEntityCenter(potentialTargetEntity))
						)

						if (magnitudeSquared < closestMagnituteSquared) {
							closestMagnituteSquared = magnitudeSquared
							targetEntity = potentialTargetEntity
						}
					}
				}
			}

			if (!targetEntity) {
				continue
			}

			const targetCenter = getEntityCenter(targetEntity)

			const direction = Vector.normalise(Vector.sub(targetCenter, rigidBody.body.position))

			entity.addComponent(
				createComponent(MoveCommandComponent, {
					inputVector: direction,
				})
			)
		}
	}
}
