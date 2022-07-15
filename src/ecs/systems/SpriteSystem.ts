import { Query, System, World } from 'ape-ecs'

import { pixiApp } from '../../pixi'
import { TransformComponent } from '../components/TransformComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { getTypedComponents } from '../../utils/entityUtils'

export class SpriteSystem extends System {
	spriteTransformQuery!: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.spriteTransformQuery = this.createQuery()
			.fromAll(SpriteComponent, TransformComponent)
			.persist()

		this.subscribe(SpriteComponent)
	}

	update() {
		this.changes.forEach((componentChange) => {
			if (componentChange.op === 'add') {
				if (componentChange.type === SpriteComponent.typeName) {
					const entity = this.world.getEntity(componentChange.entity)!
					const spriteComponents = entity.getComponents(SpriteComponent)
					for (const sprite of spriteComponents) {
						pixiApp.stage.addChild(sprite.sprite)
					}
				}
			}
		})

		const spriteTransformEntities = this.spriteTransformQuery.execute()
		for (const entity of spriteTransformEntities) {
			for (const spriteComponent of getTypedComponents(
				entity,
				SpriteComponent
			)) {
				const sprite = spriteComponent.sprite
				if (!sprite) {
					continue
				}

				for (const transform of getTypedComponents(
					entity,
					TransformComponent
				)) {
					sprite.position.set(transform.x, transform.y)
					sprite.rotation = transform.angle
				}
			}
		}
	}
}
