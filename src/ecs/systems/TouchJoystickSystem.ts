import { Entity, Query, System, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { TouchMap } from '../../framework/input/TouchState'
import { touchStateSingleton } from '../../framework/singletons'
import { createComponent } from '../../utils/componentUtils'
import { getComponentById, getTypedComponents } from '../../utils/entityUtils'
import {
	TouchJoystickComponent,
	TouchJoystickComponentInstance,
	touchJoystickSpriteBackgroundKey,
	touchJoystickSpriteIndicatorKey,
} from '../components/input/TouchJoystickComponent'
import { SpriteComponent } from '../components/SpriteComponent'

export class TouchJoystickSystem extends System {
	#touchJoystickQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.#touchJoystickQuery = this.createQuery().fromAll(TouchJoystickComponent).persist()
	}

	#getTouchDistanceVector(touchJoystick: TouchJoystickComponentInstance, touch: Touch) {
		const touchVector = Vector.create(touch.pageX, touch.pageY)
		const distanceVector = Vector.sub(touchVector, touchJoystick.center)
		return distanceVector
	}

	#updateTouchJoystickVector(
		touchJoystick: TouchJoystickComponentInstance,
		activeTouches: TouchMap
	) {
		const radiusSquared = touchJoystick.radius ** 2

		let touch: Touch | null = null

		if (touchJoystick._activeTouchIdentifier !== null) {
			touch = touchStateSingleton.getTouch(touchJoystick._activeTouchIdentifier)

			if (!touch) {
				touchJoystick._activeTouchIdentifier = null
			}
		}

		if (!touch) {
			findTouch: for (const [_, activeTouch] of activeTouches) {
				const distanceVector = this.#getTouchDistanceVector(touchJoystick, activeTouch)
				const distanceSquared = Vector.magnitudeSquared(distanceVector)

				if (distanceSquared < radiusSquared) {
					touch = activeTouch
					touchJoystick._activeTouchIdentifier = activeTouch.identifier
					break findTouch
				}
			}
		}

		if (touch) {
			const distanceVector = this.#getTouchDistanceVector(touchJoystick, touch)
			const distanceSquared = Vector.magnitudeSquared(distanceVector)
			const normalisedVector = Vector.normalise(distanceVector)
			const relativeDistance = Math.min(1, distanceSquared / radiusSquared)
			const inputVector = Vector.mult(normalisedVector, relativeDistance)

			touchJoystick._activeInputVector = inputVector
			touchJoystick.update()
		} else {
			if (touchJoystick._activeInputVector !== null) {
				touchJoystick._activeInputVector = null
				touchJoystick.update()
			}
		}
	}

	#emitTouchJoystickCommands(entity: Entity, touchJoystick: TouchJoystickComponentInstance) {
		const inputVector = touchJoystick._activeInputVector
		if (!inputVector) {
			return
		}

		for (const command of touchJoystick.commands) {
			const commandEntity = command.entity || entity
			commandEntity.addComponent(createComponent(command.component, { inputVector }))
		}
	}

	#updateTouchJoystickSprites(entity: Entity, touchJoystick: TouchJoystickComponentInstance) {
		const backgroundSprite = getComponentById<typeof SpriteComponent>(
			entity,
			touchJoystickSpriteBackgroundKey
		)?.sprite

		if (backgroundSprite) {
			backgroundSprite.position.x = touchJoystick.center.x
			backgroundSprite.position.y = touchJoystick.center.y
		}

		const indicatorSprite = getComponentById<typeof SpriteComponent>(
			entity,
			touchJoystickSpriteIndicatorKey
		)?.sprite
		if (indicatorSprite) {
			const inputVector = touchJoystick._activeInputVector
			if (inputVector) {
				indicatorSprite.position.x = touchJoystick.center.x + inputVector.x * touchJoystick.radius
				indicatorSprite.position.y = touchJoystick.center.y + inputVector.y * touchJoystick.radius
			} else {
				indicatorSprite.position.x = touchJoystick.center.x
				indicatorSprite.position.y = touchJoystick.center.y
			}
		}
	}

	update() {
		const activeTouches = touchStateSingleton.getTouches()

		for (const entity of this.#touchJoystickQuery.execute()) {
			for (const touchJoystick of getTypedComponents(entity, TouchJoystickComponent)) {
				this.#updateTouchJoystickVector(touchJoystick, activeTouches)
				this.#emitTouchJoystickCommands(entity, touchJoystick)
				this.#updateTouchJoystickSprites(entity, touchJoystick)
			}
		}
	}
}
