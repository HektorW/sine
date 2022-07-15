import { Component } from 'ape-ecs'
import { Sprite } from 'pixi.js'

export type SpriteComponentProperties = {
	sprite: Sprite | null
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
		if (this.sprite) {
			this.sprite.destroy()
		}

		this.sprite = null
	}
}
