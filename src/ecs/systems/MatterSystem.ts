import { Component, Entity, World } from 'ape-ecs'
import { Composite, Engine, Events, IEventCollision } from 'matter-js'
import { ChangeOp } from '../../constants/apeEcsConstants'
import { Tags } from '../../constants/tags'
import { getTypedComponents, getTypedOne } from '../../utils/entityUtils'
import { getEntityIdFromRigidBodyLabel, getRigidBodyLabel } from '../../utils/rigidBodyUtils'
import { CharacterComponent } from '../components/CharacterComponent'
import { DamageComponent } from '../components/DamageComponent'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { BaseSystem } from './BaseSystem'

export class MatterSystem extends BaseSystem {
	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		const engine = this.getGlobals().engine

		Events.on(engine, 'collisionStart', this.#onCollisionStart)

		this.subscribe(RigidBodyComponent)
	}

	#onCollisionStart = (event: IEventCollision<Engine>) => {
		event.pairs.forEach((pair) => {
			const { bodyA, bodyB } = pair

			const entityA = this.world.getEntity(getEntityIdFromRigidBodyLabel(bodyA.label))
			const entityB = this.world.getEntity(getEntityIdFromRigidBodyLabel(bodyB.label))

			if (!entityA || !entityB) {
				return
			}

			this.#checkDamageFromCollision(entityA, entityB)
			this.#checkDamageFromCollision(entityB, entityA)

			this.#checkRemoveEntityAfterCollision(entityA)
			this.#checkRemoveEntityAfterCollision(entityB)
		})
	}

	#checkDamageFromCollision(characterEntity: Entity, damageEntity: Entity) {
		if (characterEntity.has(Tags.Enemy) && damageEntity.has(Tags.Enemy)) {
			return
		}

		if (characterEntity.has(CharacterComponent) && damageEntity.has(DamageComponent)) {
			const character = getTypedOne(characterEntity, CharacterComponent)!
			const damage = getTypedOne(damageEntity, DamageComponent)!

			character.currentHealth -= damage.damage
		}
	}

	#checkRemoveEntityAfterCollision(entity: Entity) {
		if (entity.has(CharacterComponent)) {
			const character = getTypedOne(entity, CharacterComponent)!
			if (character.currentHealth <= 0) {
				this.world.removeEntity(entity)
			}
		} else {
			this.world.removeEntity(entity)
		}
	}

	#addEntityRigidBodyToEngine(
		engine: Engine,
		entityId: Entity['id'],
		componentId: Component['id']
	) {
		const entity = this.world.getEntity(entityId)
		if (!entity) {
			return
		}

		for (const rigidBody of getTypedComponents(entity, RigidBodyComponent)) {
			if (rigidBody.id !== componentId) {
				continue
			}

			rigidBody.body.label = getRigidBodyLabel(entityId, componentId)
			Composite.add(engine.world, rigidBody.body)
		}
	}

	#removeEntityRigidBodyFromEngine(
		engine: Engine,
		entityId: Entity['id'],
		componentId: Component['id']
	) {
		const rigidBodyLabel = getRigidBodyLabel(entityId, componentId)
		const body = engine.world.bodies.find((body) => body.label === rigidBodyLabel)
		if (body) {
			Composite.remove(engine.world, body)
		}
	}

	update() {
		const engine = this.getGlobals().engine
		const frameInfo = this.getFrameInfo()

		this.changes.forEach((change) => {
			if (change.type !== RigidBodyComponent.typeName) {
				return
			}

			switch (change.op) {
				case ChangeOp.Add: {
					this.#addEntityRigidBodyToEngine(engine, change.entity, change.component)
					break
				}

				case ChangeOp.Destroy: {
					this.#removeEntityRigidBodyFromEngine(engine, change.entity, change.component)
					break
				}
			}
		})

		Engine.update(engine, frameInfo.elapsedMs)
	}
}
