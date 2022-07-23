import './style.css'

import * as ApeECS from 'ape-ecs'
import { Bodies, Composite, Engine, Render, Vector } from 'matter-js'
import Stats from 'stats.js'
import { Graphics } from 'pixi.js'

import { GameLoop } from './framework/GameLoop'
import { TransformComponent } from './ecs/components/TransformComponent'
import { SpriteComponent } from './ecs/components/SpriteComponent'
import { Tags } from './constants/tags'
import { SpriteSystem } from './ecs/systems/SpriteSystem'
import { pixiApp } from './framework/pixi'
import { MoveableComponent } from './ecs/components/MoveableComponent'
import { FrameInfoComponent } from './ecs/components/FrameInfoComponent'
import { MoveSystem } from './ecs/systems/MoveSystem'
import { keyboardStateSingleton } from './framework/singletons'
import { TouchJoystickComponent } from './ecs/components/input/TouchJoystickComponent'
import { TouchJoystickSystem } from './ecs/systems/TouchJoystickSystem'
import { MoveCommandComponent } from './ecs/components/commands/MoveCommandComponent'
import { createTouchjoyStick } from './ecs/entities/touchJoystick'
import { ShootCommandComponent } from './ecs/components/commands/ShootCommandComponent'
import { ShootSystem } from './ecs/systems/ShootSystem'
import { WeaponComponent } from './ecs/components/WeaponComponent'
import { createPlayer } from './ecs/entities/player'
import { KeyboardKey } from './framework/input/KeyboardState'
import { RigidBodyComponent } from './ecs/components/RigidBodyComponent'
import { entityIdFrameInfo, entityIdGlobals } from './constants/entityIds'
import { componentKeyFrameInfo, componentKeyGlobals } from './constants/componentKeys'
import { createComponent } from './utils/componentUtils'
import { GlobalsComponent } from './ecs/components/GlobalsComponent'
import { SystemGroup } from './constants/systemGroups'
import { MatterSystem } from './ecs/systems/MatterSystem'
import { HomingTargetSystem } from './ecs/systems/HomingTargetSystem'
import { HomingTargetComponent } from './ecs/components/HomingTargetComponent'
import { CharacterComponent } from './ecs/components/CharacterComponent'
import { DamageComponent } from './ecs/components/DamageComponent'
import { HealthSystem } from './ecs/systems/HealthSystem'
import { spawnGroupedEnemies } from './utils/enemyUtils'
import { CollisionCategory } from './constants/collisionCategories'
import { getQueryBool, getQueryNumber } from './utils/queryUtils'

const containerEl = document.querySelector<HTMLDivElement>('#app')!

const ecsWorld = new ApeECS.World()

ecsWorld.registerTags(...Object.values(Tags))

ecsWorld.registerComponent(CharacterComponent)
ecsWorld.registerComponent(DamageComponent)
ecsWorld.registerComponent(FrameInfoComponent)
ecsWorld.registerComponent(GlobalsComponent)
ecsWorld.registerComponent(HomingTargetComponent)
ecsWorld.registerComponent(MoveableComponent)
ecsWorld.registerComponent(MoveCommandComponent)
ecsWorld.registerComponent(RigidBodyComponent)
ecsWorld.registerComponent(ShootCommandComponent)
ecsWorld.registerComponent(SpriteComponent)
ecsWorld.registerComponent(TouchJoystickComponent)
ecsWorld.registerComponent(TransformComponent)
ecsWorld.registerComponent(WeaponComponent)

const frameInfoEntity = ecsWorld.createEntity({
	id: entityIdFrameInfo,
	c: { [componentKeyFrameInfo]: createComponent(FrameInfoComponent) },
})

const engine = Engine.create({ gravity: { x: 0, y: 0 } })
ecsWorld.createEntity({
	id: entityIdGlobals,
	c: { [componentKeyGlobals]: createComponent(GlobalsComponent, { engine }) },
})

ecsWorld.registerSystem(SystemGroup.Input, TouchJoystickSystem)
ecsWorld.registerSystem(SystemGroup.Input, HomingTargetSystem)

ecsWorld.registerSystem(SystemGroup.Commands, MoveSystem)
ecsWorld.registerSystem(SystemGroup.Commands, ShootSystem)

ecsWorld.registerSystem(SystemGroup.Physics, MatterSystem)

ecsWorld.registerSystem(SystemGroup.Render, HealthSystem)
ecsWorld.registerSystem(SystemGroup.Render, SpriteSystem)

const player = ecsWorld.createEntity(createPlayer(pixiApp.view))

createTouchjoyStick(
	ecsWorld,
	Vector.create(pixiApp.view.width / 8, pixiApp.view.height - pixiApp.view.height / 4),
	player,
	[MoveCommandComponent],
	{
		up: KeyboardKey.W,
		down: KeyboardKey.S,
		left: KeyboardKey.A,
		right: KeyboardKey.D,
	}
)

createTouchjoyStick(
	ecsWorld,
	Vector.create(
		pixiApp.view.width - pixiApp.view.width / 8,
		pixiApp.view.height - pixiApp.view.height / 4
	),
	player,
	[ShootCommandComponent],
	{
		up: KeyboardKey.ArrowUp,
		down: KeyboardKey.ArrowDown,
		left: KeyboardKey.ArrowLeft,
		right: KeyboardKey.ArrowRight,
	}
)

spawnGroupedEnemies(ecsWorld, player, Vector.create(pixiApp.view.width / 2, pixiApp.view.height), 2)
spawnGroupedEnemies(ecsWorld, player, Vector.create(pixiApp.view.width / 2, 0), 2)
spawnGroupedEnemies(ecsWorld, player, Vector.create(0, pixiApp.view.height / 2), 2)
spawnGroupedEnemies(ecsWorld, player, Vector.create(pixiApp.view.width, pixiApp.view.height / 2), 2)

// spawnGroupedEnemies(ecsWorld, player, Vector.create(0, 0), 2)
// spawnGroupedEnemies(ecsWorld, player, Vector.create(0, pixiApp.view.height), 2)
// spawnGroupedEnemies(ecsWorld, player, Vector.create(pixiApp.view.width, 0), 2)
// spawnGroupedEnemies(ecsWorld, player, Vector.create(pixiApp.view.width, pixiApp.view.height), 2)

// spawnGroupedEnemies(ecsWorld, player, Vector.create(-20, pixiApp.view.height / 2), 12)

let stats: Stats | null = null

const gameLoop = (window.gameLoop = new GameLoop((time) => {
	if (getQueryBool('autostop')) {
		gameLoop.pause()
	}

	stats?.begin()

	frameInfoEntity.c[componentKeyFrameInfo].elapsedS = time.elapsedS
	frameInfoEntity.c[componentKeyFrameInfo].elapsedMs = time.elapsedMs
	frameInfoEntity.c[componentKeyFrameInfo].totalS = time.totalS
	frameInfoEntity.c[componentKeyFrameInfo].totalMs = time.totalMs

	ecsWorld.runSystems(SystemGroup.Input)
	ecsWorld.runSystems(SystemGroup.Commands)

	ecsWorld.runSystems(SystemGroup.Physics)

	ecsWorld.tick()

	keyboardStateSingleton.update()

	stats?.end()

	ecsWorld.runSystems(SystemGroup.Render)
}))

gameLoop.start()

containerEl.appendChild(pixiApp.view)

if (getQueryBool('stats') !== false) {
	stats = new Stats()
	stats.showPanel(getQueryNumber('stats') || 0)
	document.body.appendChild(stats.dom)
}

if (getQueryBool('logstats')) {
	ecsWorld.logStats(getQueryNumber('logstats') || 600)
}

if (getQueryBool('wireframes')) {
	const matterRender = Render.create({
		engine,
		options: {
			height: window.innerHeight,
			width: window.innerWidth,
		},
	})
	Render.run(matterRender)
	matterRender.canvas.style.opacity = '0.25'
	matterRender.canvas.style.position = 'absolute'
	matterRender.canvas.style.inset = '0'
	containerEl.appendChild(matterRender.canvas)
}

if (getQueryBool('floor')) {
	Composite.add(
		engine.world,
		Bodies.rectangle(pixiApp.view.width / 2, pixiApp.view.height - 5, pixiApp.view.width, 10, {
			isStatic: true,
			collisionFilter: {
				category: CollisionCategory.Wall,
			},
		})
	)
	const floorGraphic = new Graphics()
	floorGraphic.lineStyle(1, 0xffffff, 1)
	floorGraphic.drawRect(0, pixiApp.view.height - 10, pixiApp.view.width, 10)
	floorGraphic.endFill()
	pixiApp.stage.addChild(floorGraphic)
}
