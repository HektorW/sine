import { Query, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { getTypedComponents } from '../../utils/entityUtils'
import { getEntityCenter } from '../../utils/transformUtils'
import { createDamage } from '../../utils/weaponUtils'
import { ShootCommandComponent } from '../components/commands/ShootCommandComponent'
import { WeaponComponent } from '../components/WeaponComponent'
import { createBullet } from '../entities/bullet'
import { BaseSystem } from './BaseSystem'

export class ShootSystem extends BaseSystem {
	#weaponShootQuery: Query

	constructor(world: World, ...initArgs: any[]) {
		super(world, ...initArgs)

		this.#weaponShootQuery = this.createQuery()
			.fromAll(WeaponComponent, ShootCommandComponent)
			.persist()
	}

	update() {
		const frameInfo = this.getFrameInfo()

		for (const entity of this.#weaponShootQuery.execute()) {
			for (const shoot of getTypedComponents(entity, ShootCommandComponent)) {
				for (const weapon of getTypedComponents(entity, WeaponComponent)) {
					let sinceLastShot = frameInfo.totalS - weapon._lastShotTotalS
					if (sinceLastShot > weapon.shotDelayS) {
						weapon._lastShotTotalS = frameInfo.totalS

						const spawnPosition = getEntityCenter(entity)

						this.world.createEntity(
							createBullet(
								entity,
								spawnPosition,
								Vector.normalise(shoot.inputVector),
								createDamage(weapon)
							)
						)
					}

					entity.removeComponent(shoot)
				}
			}
		}
	}
}
