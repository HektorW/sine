import { Entity, IComponentConfig, IEntityConfig } from 'ape-ecs'
import { Bodies, Vector } from 'matter-js'
import { Graphics } from 'pixi.js'
import { CollisionCategory } from '../../constants/collisionCategories'
import { Tags } from '../../constants/tags'
import { createComponent } from '../../utils/componentUtils'
import { CharacterComponent } from '../components/CharacterComponent'
import { DamageComponent } from '../components/DamageComponent'
import { HomingTargetComponent } from '../components/HomingTargetComponent'
import { MoveableComponent } from '../components/MoveableComponent'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { SpriteComponent } from '../components/SpriteComponent'

const enemySize = 20
const templateGraphics = new Graphics()
templateGraphics.lineStyle(2, 0xffffff, 1)
templateGraphics.drawRect(-enemySize / 2, -enemySize / 2, enemySize, enemySize)
templateGraphics.endFill()

export function createEnemy(position: Vector, targetEntity?: Entity): IEntityConfig {
	const graphics = new Graphics(templateGraphics.geometry)

	const rigidBody = Bodies.rectangle(position.x, position.y, enemySize, enemySize, {
		density: 0.0001,

		collisionFilter: {
			category: CollisionCategory.Enemy,
			mask: CollisionCategory.Player | CollisionCategory.Enemy,
		},
	})

	const components: IComponentConfig[] = [
		createComponent(SpriteComponent, { sprite: graphics }),
		createComponent(MoveableComponent, { speed: 30 }),
		createComponent(RigidBodyComponent, {
			body: rigidBody,
		}),
		createComponent(CharacterComponent, {
			maxHealth: 10,
			currentHealth: 10,
		}),
		createComponent(DamageComponent, {
			damage: 1,
		}),
	]

	if (targetEntity) {
		components.push(
			createComponent(HomingTargetComponent, {
				targetEntity: targetEntity,
			})
		)
	}

	return {
		tags: [Tags.Enemy],

		components,
	}
}
