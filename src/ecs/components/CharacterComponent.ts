import { Component } from 'ape-ecs'
import { Graphics, Sprite } from 'pixi.js'
import { ComponentInstance } from '../../utils/componentUtils'

export type CharacterComponentConstructor = typeof CharacterComponent
export type CharacterComponentInstance = ComponentInstance<CharacterComponentConstructor>

export type CharacterComponentProperties = {
	maxHealth: number
	currentHealth: number

	_healthContainerGraphics: Sprite | Graphics | null
	_healthIndicatorGraphics: Sprite | Graphics | null
}

export class CharacterComponent extends Component {
	static typeName = 'Character'

	static properties: CharacterComponentProperties = {
		maxHealth: 1,
		currentHealth: 1,

		_healthContainerGraphics: null,
		_healthIndicatorGraphics: null,
	}

	preDestroy() {
		const ctx = this as unknown as CharacterComponentInstance

		if (ctx._healthContainerGraphics !== null) {
			ctx._healthContainerGraphics.destroy()
		}

		if (ctx._healthIndicatorGraphics !== null) {
			ctx._healthIndicatorGraphics.destroy()
		}

		ctx._healthContainerGraphics = null
		ctx._healthIndicatorGraphics = null
	}
}
