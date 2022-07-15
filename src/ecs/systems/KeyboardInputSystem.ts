import { Query, System, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { KeyboardKey } from '../../framework/KeyboardInput'
import { keyboardInputSingleton } from '../../framework/singletons'
import { getTypedComponents } from '../../utils/entityUtils'
import { KeyboardInputComponent } from '../components/KeyboardInputComponent'
import { MoveComponent } from '../components/MoveComponent'

export class KeyboardInputSystem extends System {
	keyboardInputMoveQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.keyboardInputMoveQuery = this.createQuery()
			.fromAll(KeyboardInputComponent, MoveComponent)
			.persist()
	}

	update() {
		const entities = this.keyboardInputMoveQuery.execute()
		for (const entity of entities) {
			for (const move of getTypedComponents(entity, MoveComponent)) {
				const moveVector = Vector.create(0, 0)

				if (keyboardInputSingleton.isKeyDown(KeyboardKey.A)) {
					moveVector.x += -1
				}
				if (keyboardInputSingleton.isKeyDown(KeyboardKey.D)) {
					moveVector.x += 1
				}
				if (keyboardInputSingleton.isKeyDown(KeyboardKey.W)) {
					moveVector.y += -1
				}
				if (keyboardInputSingleton.isKeyDown(KeyboardKey.S)) {
					moveVector.y += 1
				}

				move.direction = Vector.normalise(moveVector)
			}
		}
	}
}
