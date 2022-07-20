import './style.css'

import * as ApeECS from 'ape-ecs'
import { Vector } from 'matter-js'
import Stats from 'stats.js'

import { GameLoop } from './framework/GameLoop'
import { TransformComponent } from './ecs/components/TransformComponent'
import { SpriteComponent } from './ecs/components/SpriteComponent'
import { Tags } from './ecs/tags'
import { SpriteSystem } from './ecs/systems/SpriteSystem'
import { pixiApp } from './pixi'
import { MoveableComponent } from './ecs/components/MoveableComponent'
import { FrameInfoComponent } from './ecs/components/FrameInfoComponent'
import { MoveSystem } from './ecs/systems/MoveSystem'
import { KeyboardInputComponent } from './ecs/components/input/KeyboardInputComponent'
import { KeyboardInputSystem } from './ecs/systems/KeyboardInputSystem'
import { keyboardStateSingleton } from './framework/singletons'
import { TouchJoystickComponent } from './ecs/components/input/TouchJoystickComponent'
import { TouchJoystickSystem } from './ecs/systems/TouchJoystickSystem'
import { MoveCommandComponent } from './ecs/components/commands/MoveCommandComponent'
import { createTouchjoyStick } from './ecs/entities/touchJoystick'
import { ShootCommandComponent } from './ecs/components/commands/ShootCommandComponent'
import { ShootSystem } from './ecs/systems/ShootSystem'
import { WeaponComponent } from './ecs/components/WeaponComponent'
import { createPlayer } from './ecs/entities/player'

const containerEl = document.querySelector<HTMLDivElement>('#app')!

const ecsWorld = new ApeECS.World()

ecsWorld.registerTags(...Object.values(Tags))

ecsWorld.registerComponent(FrameInfoComponent)
ecsWorld.registerComponent(KeyboardInputComponent)
ecsWorld.registerComponent(MoveableComponent)
ecsWorld.registerComponent(SpriteComponent)
ecsWorld.registerComponent(TouchJoystickComponent)
ecsWorld.registerComponent(TransformComponent)
ecsWorld.registerComponent(MoveCommandComponent)
ecsWorld.registerComponent(ShootCommandComponent)
ecsWorld.registerComponent(WeaponComponent)

const frameInfoEntity = ecsWorld.createEntity({
	id: 'frame-info',
	c: {
		time: {
			type: FrameInfoComponent.typeName,
		},
	},
})

ecsWorld.registerSystem('frame', KeyboardInputSystem)
ecsWorld.registerSystem('frame', TouchJoystickSystem)
ecsWorld.registerSystem('frame', ShootSystem)
ecsWorld.registerSystem('frame', MoveSystem)
ecsWorld.registerSystem('frame', SpriteSystem)

const player = ecsWorld.createEntity(createPlayer(pixiApp.view))

createTouchjoyStick(
	ecsWorld,
	Vector.create(pixiApp.view.width / 4, pixiApp.view.height - pixiApp.view.height / 4),
	player,
	[MoveCommandComponent]
)

createTouchjoyStick(
	ecsWorld,
	Vector.create(
		pixiApp.view.width - pixiApp.view.width / 4,
		pixiApp.view.height - pixiApp.view.height / 4
	),
	player,
	[ShootCommandComponent]
)

const stats = new Stats()
document.body.appendChild(stats.dom)

const gameLoop = new GameLoop((time) => {
	if (window.location.search.includes('autostop')) {
		gameLoop.stop()
	}

	stats.begin()

	frameInfoEntity.c.time.elapsedS = time.elapsedS
	frameInfoEntity.c.time.elapsedMs = time.elapsedMs
	frameInfoEntity.c.time.totalS = time.totalS
	frameInfoEntity.c.time.totalMs = time.totalMs

	ecsWorld.runSystems('frame')
	ecsWorld.tick()

	keyboardStateSingleton.update()

	stats.end()
})

gameLoop.start()

containerEl.appendChild(pixiApp.view)
