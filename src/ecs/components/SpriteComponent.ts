import { Component } from 'ape-ecs'
import { Graphics, Sprite } from 'pixi.js'

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
		if (this.sprite) {
			this.sprite.destroy()
		}

		this.sprite = null
	}
}
