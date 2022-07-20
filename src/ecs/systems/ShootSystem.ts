import { Query, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { getTypedComponents } from '../../utils/entityUtils'
import { ShootCommandComponent } from '../components/commands/ShootCommandComponent'
import { TransformComponent } from '../components/TransformComponent'
import { WeaponComponent } from '../components/WeaponComponent'
import { createBullet } from '../entities/bullet'
import { BaseSystem } from './BaseSystem'

export class ShootSystem extends BaseSystem {
	#weaponShootQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.#weaponShootQuery = this.createQuery()
			.fromAll(TransformComponent, WeaponComponent, ShootCommandComponent)
			.persist()
	}

	update() {
		const frameInfo = this.getFrameInfo()

		for (const entity of this.#weaponShootQuery.execute()) {
			for (const transform of getTypedComponents(entity, TransformComponent)) {
				for (const weapon of getTypedComponents(entity, WeaponComponent)) {
					for (const shoot of getTypedComponents(entity, ShootCommandComponent)) {
						let sinceLastShot = frameInfo.totalS - weapon._lastShotTotalS
						if (sinceLastShot > weapon.shotDelayS) {
							weapon._lastShotTotalS = frameInfo.totalS
							this.world.createEntity(createBullet(transform, Vector.normalise(shoot.inputVector)))
						}

						entity.removeComponent(shoot)
					}
				}
			}
		}
	}
}
