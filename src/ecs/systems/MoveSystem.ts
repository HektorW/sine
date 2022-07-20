import { Query, World } from 'ape-ecs'
import { getTypedComponents } from '../../utils/entityUtils'
import { MoveableComponent } from '../components/MoveableComponent'
import { TransformComponent } from '../components/TransformComponent'
import { MoveCommandComponent } from '../components/commands/MoveCommandComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { BaseSystem } from './BaseSystem'

export class MoveSystem extends BaseSystem {
	declare transformMoveQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.transformMoveQuery = this.createQuery()
			.fromAll(TransformComponent, MoveableComponent, MoveCommandComponent)
			.persist()
	}

	update() {
		const frameInfo = this.getFrameInfo()

		for (const entity of this.transformMoveQuery.execute()) {
			for (const transform of getTypedComponents(entity, TransformComponent)) {
				for (const moveable of getTypedComponents(entity, MoveableComponent)) {
					for (const moveCommand of getTypedComponents(entity, MoveCommandComponent)) {
						transform.x += frameInfo.elapsedS * moveCommand.inputVector.x * moveable.speed
						transform.y += frameInfo.elapsedS * moveCommand.inputVector.y * moveable.speed

						transform.update()

						if (entity.has(SpriteComponent)) {
							for (const spriteComponent of getTypedComponents(entity, SpriteComponent)) {
								const sprite = spriteComponent.sprite
								if (sprite) {
									sprite.position.x = transform.x
									sprite.position.y = transform.y
								}
							}
						}

						if (!moveCommand.recurring) {
							entity.removeComponent(moveCommand)
						}
					}
				}
			}
		}
	}
}
