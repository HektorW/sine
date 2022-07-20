import { Entity, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { Graphics } from 'pixi.js'
import { createComponent } from '../../utils/componentUtils'
import { SpriteComponent } from '../components/SpriteComponent'
import {
	TouchJoystickComponent,
	touchJoystickSpriteBackgroundKey,
	touchJoystickSpriteIndicatorKey,
} from '../components/input/TouchJoystickComponent'
import { BaseInputCommandComponentConstructor } from '../components/commands/BaseInputCommand'

export function createTouchjoyStick(
	world: World,
	position: Vector,
	controlEntity: Entity,
	commandComponents: BaseInputCommandComponentConstructor[]
) {
	const backgroundRadiusradius = 75
	const indicatorRadius = 10

	const backgroundCircle = new Graphics()
	backgroundCircle.lineStyle(2, 0xffffff, 0.5)
	backgroundCircle.drawCircle(0, 0, backgroundRadiusradius)
	backgroundCircle.endFill()

	const indicatorCircle = new Graphics()
	indicatorCircle.lineStyle(1, 0xffffff, 0.5)
	indicatorCircle.beginFill(0xffffff, 0.25)
	indicatorCircle.drawCircle(0, 0, indicatorRadius)
	indicatorCircle.endFill()

	return world.createEntity({
		c: {
			[touchJoystickSpriteBackgroundKey]: createComponent(SpriteComponent, {
				sprite: backgroundCircle,
			}),

			[touchJoystickSpriteIndicatorKey]: createComponent(SpriteComponent, {
				sprite: indicatorCircle,
			}),

			touchJoystick: createComponent(TouchJoystickComponent, {
				center: position,
				radius: backgroundRadiusradius,
				commands: commandComponents.map((component) => ({
					component,
					entity: controlEntity,
				})),
			}),
		},
	})
}
