import { IEntityConfig } from 'ape-ecs'
import { Graphics } from 'pixi.js'
import { createComponent } from '../../utils/componentUtils'
import { MoveableComponent } from '../components/MoveableComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { TransformComponent } from '../components/TransformComponent'
import { WeaponComponent } from '../components/WeaponComponent'

export function createPlayer(viewport: { width: number; height: number }): IEntityConfig {
	const rectSize = 20

	const graphics = new Graphics()
	graphics.beginFill(0xffffff, 1)
	graphics.drawRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize)
	graphics.endFill()

	return {
		c: {
			move: createComponent(MoveableComponent, { speed: 500 }),
			transform: createComponent(TransformComponent, {
				x: viewport.width / 2,
				y: viewport.height / 2,
			}),
		},

		components: [
			createComponent(SpriteComponent, { sprite: graphics }),
			createComponent(WeaponComponent, {
				shotDelayS: 0.1,
			}),
		],
	}
}
