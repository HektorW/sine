import { IEntityConfig } from 'ape-ecs'
import { Vector } from 'matter-js'
import { Graphics } from 'pixi.js'
import { createComponent } from '../../utils/componentUtils'
import { MoveCommandComponent } from '../components/commands/MoveCommandComponent'
import { MoveableComponent } from '../components/MoveableComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { TransformComponent } from '../components/TransformComponent'

const bulletSize = 8
const bulletGraphics = new Graphics()
bulletGraphics.lineStyle(1, 0xffffff, 1)
bulletGraphics.drawRect(-bulletSize / 2, -bulletSize / 2, bulletSize, bulletSize)
bulletGraphics.endFill()

export function createBullet(position: Vector, direction: Vector, speed = 800): IEntityConfig {
	const graphics = new Graphics(bulletGraphics.geometry)

	graphics.rotation = Math.PI - Math.atan2(direction.x, direction.y)

	return {
		components: [
			createComponent(SpriteComponent, { sprite: graphics }),
			createComponent(TransformComponent, {
				x: position.x,
				y: position.y,
			}),
			createComponent(MoveableComponent, {
				speed,
			}),
			createComponent(MoveCommandComponent, {
				inputVector: Vector.clone(direction),
				recurring: true,
			}),
		],
	}
}
