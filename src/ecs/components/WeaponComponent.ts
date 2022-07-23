import { Component } from 'ape-ecs'
import { ComponentInstance } from '../../utils/componentUtils'

export type WeaponProperties = {
	shotDelayS: number
	maxDamage: number
	minDamage: number

	_lastShotTotalS: number
}

export type WeaponComponentInstance = ComponentInstance<typeof WeaponComponent>

export class WeaponComponent extends Component {
	static typeName = 'weapon-component'

	static properties: WeaponProperties = {
		shotDelayS: 1000,
		maxDamage: 1,
		minDamage: 1,

		_lastShotTotalS: 0,
	}
}
