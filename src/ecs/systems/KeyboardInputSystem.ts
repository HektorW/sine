import { Query, System, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { KeyboardKey } from '../../framework/input/KeyboardState'
import { keyboardStateSingleton } from '../../framework/singletons'
import { getTypedComponents } from '../../utils/entityUtils'
import { KeyboardInputComponent } from '../components/input/KeyboardInputComponent'
import { MoveableComponent } from '../components/MoveableComponent'

export class KeyboardInputSystem extends System {
	keyboardInputMoveQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.keyboardInputMoveQuery = this.createQuery()
			.fromAll(KeyboardInputComponent, MoveableComponent)
			.persist()
	}

	update() {
		const entities = this.keyboardInputMoveQuery.execute()
		for (const entity of entities) {
			for (const move of getTypedComponents(entity, MoveableComponent)) {
				const moveVector = Vector.create(0, 0)

				if (keyboardStateSingleton.isKeyDown(KeyboardKey.A)) {
					moveVector.x += -1
				}
				if (keyboardStateSingleton.isKeyDown(KeyboardKey.D)) {
					moveVector.x += 1
				}
				if (keyboardStateSingleton.isKeyDown(KeyboardKey.W)) {
					moveVector.y += -1
				}
				if (keyboardStateSingleton.isKeyDown(KeyboardKey.S)) {
					moveVector.y += 1
				}

				move.direction = Vector.normalise(moveVector)
			}
		}
	}
}
