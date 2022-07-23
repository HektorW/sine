import { Component } from 'ape-ecs'
import { Graphics, Sprite } from 'pixi.js'
import { ComponentInstance } from '../../utils/componentUtils'

export type SpriteComponentConstructor = typeof SpriteComponent
export type SpriteComponentInstance = ComponentInstance<SpriteComponentConstructor>

export type SpriteComponentProperties = {
	sprite: Sprite | Graphics | null
	layer: string
	color: number
}

export class SpriteComponent extends Component {
	static typeName = 'Sprite'

	static properties: SpriteComponentProperties = {
		sprite: null,
		layer: 'main',
		color: 0x000000,
	}

	preDestroy() {
		const ctx = this as unknown as SpriteComponentInstance

		if (ctx.sprite !== null) {
			ctx.sprite.destroy()
		}

		ctx.sprite = null
	}
}
