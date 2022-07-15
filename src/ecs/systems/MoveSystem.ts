import { Query, System, World } from 'ape-ecs'
import { getComponentById, getTypedComponents } from '../../utils/entityUtils'
import { TypedComponent } from '../../utils/componentUtils'
import { FrameInfoComponent } from '../components/FrameInfoComponent'
import { MoveComponent } from '../components/MoveComponent'
import { TransformComponent } from '../components/TransformComponent'

export class MoveSystem extends System {
	time: TypedComponent<typeof FrameInfoComponent>
	transformMoveQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.time = getComponentById<typeof FrameInfoComponent>(
			this.world.getEntity('frame-info')!,
			'time'
		)

		this.transformMoveQuery = this.createQuery()
			.fromAll(TransformComponent, MoveComponent)
			.persist()
	}

	update() {
		const transformMoveEntities = this.transformMoveQuery.execute()
		for (const entity of transformMoveEntities) {
			for (const transform of getTypedComponents(entity, TransformComponent)) {
				for (const move of getTypedComponents(entity, MoveComponent)) {
					transform.x += this.time.elapsedS * move.direction.x * move.speed
					transform.y += this.time.elapsedS * move.direction.y * move.speed
				}
			}
		}
	}
}
