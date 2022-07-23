import { Entity, Query, System, World } from 'ape-ecs'

import { pixiApp } from '../../framework/pixi'
import { TransformComponent } from '../components/TransformComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { getTypedComponents } from '../../utils/entityUtils'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { ChangeOp } from '../../constants/apeEcsConstants'

export class SpriteSystem extends System {
	#spriteTransformQuery: Query
	#spriteRigidBodyQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.#spriteTransformQuery = this.createQuery()
			.fromAll(SpriteComponent, TransformComponent)
			.persist()

		this.#spriteRigidBodyQuery = this.createQuery()
			.fromAll(SpriteComponent, RigidBodyComponent)
			.persist()

		this.subscribe(SpriteComponent)
	}

	#addEntitySprites(entityId: Entity['id']) {
		const entity = this.world.getEntity(entityId)
		if (!entity) {
			return
		}

		for (const spriteComponent of getTypedComponents(entity, SpriteComponent)) {
			if (spriteComponent.sprite) {
				pixiApp.stage.addChild(spriteComponent.sprite)
			}
		}
	}

	#updateComponentChanges() {
		this.changes.forEach((componentChange) => {
			if (componentChange.op === ChangeOp.Add) {
				if (componentChange.type === SpriteComponent.typeName) {
					this.#addEntitySprites(componentChange.entity)
				}
			}
		})
	}

	update() {
		this.#updateComponentChanges()

		for (const entity of this.#spriteRigidBodyQuery.execute()) {
			spriteLoop: for (const spriteComponent of getTypedComponents(entity, SpriteComponent)) {
				const sprite = spriteComponent.sprite
				if (!sprite) {
					continue spriteLoop
				}

				for (const rigidBody of getTypedComponents(entity, RigidBodyComponent)) {
					sprite.position.x = rigidBody.body.position.x
					sprite.position.y = rigidBody.body.position.y
					sprite.rotation = rigidBody.body.angle
				}
			}
		}
	}
}
