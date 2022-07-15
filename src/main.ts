import './style.css'

import * as ApeECS from 'ape-ecs'
import * as PIXI from 'pixi.js'

import rect10x10white from './assets/textures/rect_20x22_white.jpg'
import { GameLoop } from './framework/GameLoop'
import { TransformComponent } from './ecs/components/TransformComponent'
import { SpriteComponent } from './ecs/components/SpriteComponent'
import { Tags } from './ecs/tags'
import { SpriteSystem } from './ecs/systems/SpriteSystem'
import { pixiApp } from './pixi'
import { MoveComponent } from './ecs/components/MoveComponent'
import { FrameInfoComponent } from './ecs/components/FrameInfoComponent'
import { MoveSystem } from './ecs/systems/MoveSystem'
import { KeyboardInputComponent } from './ecs/components/KeyboardInputComponent'
import { KeyboardInputSystem } from './ecs/systems/KeyboardInputSystem'
import { keyboardInputSingleton } from './framework/Singletons'
import { createComponent } from './utils/componentUtils'

const containerEl = document.querySelector<HTMLDivElement>('#app')!

const sprite = PIXI.Sprite.from(rect10x10white)
sprite.tint = 0x00ff00

const ecsWorld = new ApeECS.World()

ecsWorld.registerTags(...Object.values(Tags))

ecsWorld.registerComponent(FrameInfoComponent)
ecsWorld.registerComponent(KeyboardInputComponent)
ecsWorld.registerComponent(MoveComponent)
ecsWorld.registerComponent(SpriteComponent)
ecsWorld.registerComponent(TransformComponent)

const frameInfoEntity = ecsWorld.createEntity({
	id: 'frame-info',
	c: {
		time: {
			type: FrameInfoComponent.typeName,
		},
	},
})

ecsWorld.registerSystem('frame', KeyboardInputSystem)
ecsWorld.registerSystem('frame', MoveSystem)
ecsWorld.registerSystem('frame', SpriteSystem)

ecsWorld.createEntity({
	components: [
		createComponent(TransformComponent, {
			x: pixiApp.view.width / 2,
			y: pixiApp.view.height / 2,
		}),
		createComponent(SpriteComponent, { sprite }),
		createComponent(MoveComponent, { speed: 300 }),
		createComponent(KeyboardInputComponent),
	],
})

const gameLoop = new GameLoop((time) => {
	// gameLoop.stop()

	frameInfoEntity.c.time.elapsedS = time.elapsedS
	frameInfoEntity.c.time.elapsedMs = time.elapsedMs
	frameInfoEntity.c.time.totalS = time.totalS
	frameInfoEntity.c.time.totalMs = time.totalMs

	ecsWorld.runSystems('frame')
	ecsWorld.tick()

	keyboardInputSingleton.update()
})

gameLoop.start()

containerEl.appendChild(pixiApp.view)
