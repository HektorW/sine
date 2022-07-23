import { Component, Entity, Query, World } from 'ape-ecs'
import { Graphics } from 'pixi.js'
import { ChangeOp } from '../../constants/apeEcsConstants'
import { pixiApp } from '../../framework/pixi'
import { getTypedComponents } from '../../utils/entityUtils'
import { CharacterComponent } from '../components/CharacterComponent'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { BaseSystem } from './BaseSystem'

const healthContainerGraphicsTemplate = new Graphics()
healthContainerGraphicsTemplate.lineStyle(1, 0xffffff, 1)
healthContainerGraphicsTemplate.drawRect(-10, 0, 20, 4)
healthContainerGraphicsTemplate.endFill()

const healthIndicatorGraphicsTemplate = new Graphics()
healthIndicatorGraphicsTemplate.beginFill(0xffffff, 1)
healthIndicatorGraphicsTemplate.drawRect(0, 0, 20, 4)
healthContainerGraphicsTemplate.endFill()

export class HealthSystem extends BaseSystem {
	#characterRigidBodyQuery: Query

	constructor(world: World) {
		super(world)

		this.#characterRigidBodyQuery = this.createQuery()
			.fromAll(CharacterComponent, RigidBodyComponent)
			.persist()

		this.subscribe(CharacterComponent)
	}

	#addCharacterSprite(entityId: Entity['id'], componentId: Component['id']) {
		const entity = this.world.getEntity(entityId)
		if (!entity) {
			return
		}

		for (const character of getTypedComponents(entity, CharacterComponent)) {
			if (character.id !== componentId) {
				continue
			}

			if (character._healthContainerGraphics !== null) {
				continue
			}

			character._healthContainerGraphics = new Graphics(healthContainerGraphicsTemplate.geometry)
			character._healthIndicatorGraphics = new Graphics(healthIndicatorGraphicsTemplate.geometry)
			character._healthIndicatorGraphics.position.x = -10
			character._healthContainerGraphics.addChild(character._healthIndicatorGraphics)
			pixiApp.stage.addChild(character._healthContainerGraphics)
		}
	}

	update() {
		this.changes.forEach((change) => {
			if (change.type !== CharacterComponent.typeName) {
				return
			}

			if (change.op === ChangeOp.Add) {
				this.#addCharacterSprite(change.entity, change.component)
			}
		})

		for (const entity of this.#characterRigidBodyQuery.execute()) {
			for (const character of getTypedComponents(entity, CharacterComponent)) {
				if (
					character._healthContainerGraphics === null ||
					character._healthIndicatorGraphics === null
				) {
					continue
				}

				for (const rigidBody of getTypedComponents(entity, RigidBodyComponent)) {
					character._healthContainerGraphics.position.x = rigidBody.body.position.x
					character._healthContainerGraphics.position.y = rigidBody.body.bounds.min.y - 10

					const width = rigidBody.body.bounds.max.x - rigidBody.body.bounds.min.x

					const baseScale = width / healthContainerGraphicsTemplate.width

					character._healthContainerGraphics.scale.x = baseScale
					character._healthIndicatorGraphics.scale.x = character.currentHealth / character.maxHealth
				}
			}
		}
	}
}
