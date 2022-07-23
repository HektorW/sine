import { Entity, IEntityConfig } from 'ape-ecs'
import { Bodies, Body, Vector } from 'matter-js'
import { Graphics } from 'pixi.js'
import { CollisionCategory } from '../../constants/collisionCategories'
import { Tags } from '../../constants/tags'
import { createComponent } from '../../utils/componentUtils'
import { MoveCommandComponent } from '../components/commands/MoveCommandComponent'
import { DamageComponent } from '../components/DamageComponent'
import { HomingTargetComponent } from '../components/HomingTargetComponent'
import { MoveableComponent } from '../components/MoveableComponent'
import { RigidBodyComponent } from '../components/RigidBodyComponent'
import { SpriteComponent } from '../components/SpriteComponent'

const bulletSize = 8
const bulletGraphics = new Graphics()
bulletGraphics.lineStyle(1, 0xffffff, 1)
bulletGraphics.drawRect(-bulletSize / 2, -bulletSize / 2, bulletSize, bulletSize)
bulletGraphics.endFill()

export function createBullet(
	sourceEntity: Entity,
	position: Vector,
	direction: Vector,
	damage: number,
	speed = 300
): IEntityConfig {
	const graphics = new Graphics(bulletGraphics.geometry)

	const body = Bodies.rectangle(position.x, position.y, bulletSize, bulletSize, {
		friction: 0,
		frictionAir: 0,
		frictionStatic: 0,

		collisionFilter: {
			category: CollisionCategory.Player,
			mask: CollisionCategory.Enemy,
		},
	})

	Body.setAngle(body, Math.PI - Math.atan2(direction.x, direction.y))

	return {
		components: [
			createComponent(DamageComponent, {
				damage: damage,
				sourceEntity,
			}),
			createComponent(SpriteComponent, { sprite: graphics }),
			createComponent(RigidBodyComponent, {
				body,
			}),
			createComponent(MoveableComponent, {
				speed,
			}),
			createComponent(MoveCommandComponent, {
				inputVector: Vector.clone(direction),
				recurring: true,
			}),
			// createComponent(HomingTargetComponent, {
			// 	targetTag: Tags.Enemy,
			// }),
		],
	}
}
