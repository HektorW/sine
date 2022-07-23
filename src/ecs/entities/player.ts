import { IEntityConfig } from 'ape-ecs'
import { Bodies } from 'matter-js'
import { Graphics } from 'pixi.js'
import { CollisionCategory } from '../../constants/collisionCategories'
import { Tags } from '../../constants/tags'
import { createComponent } from '../../utils/componentUtils'
import { CharacterComponent } from '../components/CharacterComponent'
import { MoveableComponent } from '../components/MoveableComponent'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { WeaponComponent } from '../components/WeaponComponent'

export function createPlayer(viewport: { width: number; height: number }): IEntityConfig {
	const rectSize = 25

	const x = viewport.width / 2
	const y = viewport.height / 2

	const graphics = new Graphics()
	graphics.beginFill(0xffffff, 1)
	graphics.drawRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize)
	graphics.endFill()

	const body = Bodies.rectangle(x, y, rectSize, rectSize, {
		isSensor: true,

		frictionAir: 0.1,

		collisionFilter: {
			category: CollisionCategory.Player,
			mask: CollisionCategory.Wall | CollisionCategory.Enemy,
		},
	})

	return {
		tags: [Tags.Player],

		components: [
			createComponent(MoveableComponent, { speed: 200 }),

			createComponent(RigidBodyComponent, {
				body,
			}),

			createComponent(SpriteComponent, { sprite: graphics }),

			createComponent(WeaponComponent, {
				shotDelayS: 0.15,
				maxDamage: 5,
				minDamage: 2,
			}),

			createComponent(CharacterComponent, {
				maxHealth: 100,
				currentHealth: 100,
			}),
		],
	}
}
