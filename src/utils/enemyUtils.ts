import { Entity, World } from 'ape-ecs'
import { Vector } from 'matter-js'
import { createEnemy } from '../ecs/entities/enemy'

export function spawnGroupedEnemies(
	world: World,
	player: Entity,
	center: Vector,
	iterations: number,
	margin = 60
) {
	const xCount = iterations
	const yCount = iterations
	for (let xIndex = 0; xIndex < xCount; xIndex += 1) {
		for (let yIndex = 0; yIndex < yCount; yIndex += 1) {
			const x = center.x + (xIndex - xCount / 2) * margin
			const y = center.y + (yIndex - yCount / 2) * margin

			world.createEntity(createEnemy(Vector.create(x, y), player))
		}
	}
}
